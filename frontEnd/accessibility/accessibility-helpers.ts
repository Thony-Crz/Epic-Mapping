import { Page, Locator } from '@playwright/test';

/**
 * Utilitaires pour les tests d'accessibilite
 */

export class AccessibilityHelper {
	constructor(private page: Page) {}

	/**
	 * Verifie si un element a un nom accessible
	 */
	async hasAccessibleName(locator: Locator): Promise<boolean> {
		const ariaLabel = await locator.getAttribute('aria-label');
		const ariaLabelledby = await locator.getAttribute('aria-labelledby');
		const textContent = await locator.textContent();
		const title = await locator.getAttribute('title');
		
		return !!(ariaLabel || ariaLabelledby || textContent?.trim() || title);
	}

	/**
	 * Verifie si un element a une description accessible
	 */
	async hasAccessibleDescription(locator: Locator): Promise<boolean> {
		const ariaDescribedby = await locator.getAttribute('aria-describedby');
		const title = await locator.getAttribute('title');
		
		if (ariaDescribedby) {
			const descriptionElement = this.page.locator(`#${ariaDescribedby}`);
			const descriptionText = await descriptionElement.textContent();
			return !!descriptionText?.trim();
		}
		
		return !!title;
	}

	/**
	 * Obtient tous les elements focusables sur la page
	 */
	async getFocusableElements(): Promise<Locator[]> {
		return await this.page.locator(
			'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
		).all();
	}

	/**
	 * Verifie l'ordre de tabulation logique
	 */
	async verifyTabOrder(): Promise<{ success: boolean; errors: string[] }> {
		const focusableElements = await this.getFocusableElements();
		const errors: string[] = [];
		
		if (focusableElements.length === 0) {
			return { success: true, errors: [] };
		}
		
		// Commencer par le premier element
		await focusableElements[0].focus();
		
		for (let i = 1; i < focusableElements.length; i++) {
			await this.page.keyboard.press('Tab');
			
			const currentFocused = await this.page.evaluate(() => document.activeElement);
			const expectedElement = await focusableElements[i].evaluate(el => el);
			
			if (currentFocused !== expectedElement) {
				errors.push(`Ordre de tabulation incorrect a l'index ${i}`);
			}
		}
		
		return { success: errors.length === 0, errors };
	}

	/**
	 * Verifie si tous les formulaires ont des labels
	 */
	async verifyFormLabels(): Promise<{ success: boolean; errors: string[] }> {
		const formControls = await this.page.locator('input, select, textarea').all();
		const errors: string[] = [];
		
		for (const control of formControls) {
			const hasLabel = await this.hasFormLabel(control);
			
			if (!hasLabel) {
				const id = await control.getAttribute('id');
				const type = await control.getAttribute('type');
				errors.push(`Champ sans label: id=${id}, type=${type}`);
			}
		}
		
		return { success: errors.length === 0, errors };
	}

	/**
	 * Verifie si un champ de formulaire a un label
	 */
	private async hasFormLabel(control: Locator): Promise<boolean> {
		const id = await control.getAttribute('id');
		const ariaLabel = await control.getAttribute('aria-label');
		const ariaLabelledby = await control.getAttribute('aria-labelledby');
		
		// Label explicite
		if (id) {
			const explicitLabel = await this.page.locator(`label[for="${id}"]`).count();
			if (explicitLabel > 0) return true;
		}
		
		// Label implicite (input dans label)
		const parentLabel = await control.locator('xpath=ancestor::label').count();
		if (parentLabel > 0) return true;
		
		// ARIA labels
		if (ariaLabel || ariaLabelledby) return true;
		
		return false;
	}

	/**
	 * Verifie la hierarchie des titres
	 */
	async verifyHeadingHierarchy(): Promise<{ success: boolean; errors: string[] }> {
		const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
		const errors: string[] = [];
		const levels: number[] = [];
		
		for (const heading of headings) {
			const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
			const level = parseInt(tagName.substring(1));
			levels.push(level);
		}
		
		// Verifier qu'il y a au moins un h1
		if (!levels.includes(1)) {
			errors.push('Aucun titre h1 trouve sur la page');
		}
		
		// Verifier qu'il n'y a pas de saut de niveau
		for (let i = 1; i < levels.length; i++) {
			const currentLevel = levels[i];
			const previousLevel = levels[i - 1];
			
			if (currentLevel - previousLevel > 1) {
				errors.push(`Saut de niveau de titre detecte: h${previousLevel} vers h${currentLevel}`);
			}
		}
		
		return { success: errors.length === 0, errors };
	}

	/**
	 * Verifie les images sans texte alternatif
	 */
	async verifyImageAlts(): Promise<{ success: boolean; errors: string[] }> {
		const images = await this.page.locator('img').all();
		const errors: string[] = [];
		
		for (const img of images) {
			const hasAlt = await this.hasImageAlt(img);
			
			if (!hasAlt) {
				const src = await img.getAttribute('src');
				errors.push(`Image sans texte alternatif: ${src}`);
			}
		}
		
		return { success: errors.length === 0, errors };
	}

	/**
	 * Verifie si une image a un texte alternatif
	 */
	private async hasImageAlt(img: Locator): Promise<boolean> {
		const alt = await img.getAttribute('alt');
		const ariaLabel = await img.getAttribute('aria-label');
		const ariaLabelledby = await img.getAttribute('aria-labelledby');
		const ariaHidden = await img.getAttribute('aria-hidden');
		const role = await img.getAttribute('role');
		
		// Image decorative
		if (alt === '' || ariaHidden === 'true' || role === 'presentation') {
			return true;
		}
		
		// Image informative
		return !!(alt || ariaLabel || ariaLabelledby);
	}

	/**
	 * Simule la navigation au clavier et verifie l'accessibilite
	 */
	async simulateKeyboardNavigation(): Promise<{ success: boolean; errors: string[] }> {
		const focusableElements = await this.getFocusableElements();
		const errors: string[] = [];
		
		for (const element of focusableElements) {
			try {
				await element.focus();
				
				// Verifier que l'element peut recevoir le focus
				const isFocused = await element.evaluate(el => el === document.activeElement);
				
				if (!isFocused) {
					errors.push('Element ne peut pas recevoir le focus');
				}
				
				// Verifier que l'element a un indicateur de focus visible
				const hasFocusIndicator = await this.hasVisibleFocus(element);
				
				if (!hasFocusIndicator) {
					errors.push('Element sans indicateur de focus visible');
				}
			} catch (error) {
				errors.push(`Erreur lors du focus: ${error}`);
			}
		}
		
		return { success: errors.length === 0, errors };
	}

	/**
	 * Verifie si un element a un indicateur de focus visible
	 */
	private async hasVisibleFocus(element: Locator): Promise<boolean> {
		const styles = await element.evaluate(el => {
			const style = window.getComputedStyle(el);
			return {
				outline: style.outline,
				outlineWidth: style.outlineWidth,
				boxShadow: style.boxShadow
			};
		});
		
		return (
			styles.outline !== 'none' ||
			styles.outlineWidth !== '0px' ||
			styles.boxShadow !== 'none'
		);
	}

	/**
	 * Verifie l'accessibilite des couleurs (simulation daltonisme)
	 */
	async verifyColorAccessibility(): Promise<{ success: boolean; errors: string[] }> {
		const errors: string[] = [];
		
		try {
			// Appliquer un filtre de daltonisme
			await this.page.addStyleTag({
				content: `
					* {
						filter: grayscale(100%) !important;
					}
				`
			});
			
			// Verifier que les elements importants restent distinguables
			const importantElements = await this.page.locator(
				'button, [role="button"], .error, .warning, .success, [aria-invalid="true"]'
			).all();
			
			for (const element of importantElements) {
				const isVisible = await element.isVisible();
				const hasTextContent = await element.textContent();
				
				if (!isVisible || !hasTextContent?.trim()) {
					errors.push('Element important non distinguable sans couleur');
				}
			}
			
			// Retirer le filtre
			await this.page.addStyleTag({
				content: `
					* {
						filter: none !important;
					}
				`
			});
		} catch (error) {
			errors.push(`Erreur lors du test de couleur: ${error}`);
		}
		
		return { success: errors.length === 0, errors };
	}

	/**
	 * Rapport complet d'accessibilite
	 */
	async generateAccessibilityReport(): Promise<{
		success: boolean;
		summary: {
			tabOrder: boolean;
			formLabels: boolean;
			headingHierarchy: boolean;
			imageAlts: boolean;
			keyboardNavigation: boolean;
			colorAccessibility: boolean;
		};
		errors: string[];
	}> {
		const allErrors: string[] = [];
		
		const tabOrderResult = await this.verifyTabOrder();
		const formLabelsResult = await this.verifyFormLabels();
		const headingHierarchyResult = await this.verifyHeadingHierarchy();
		const imageAltsResult = await this.verifyImageAlts();
		const keyboardNavigationResult = await this.simulateKeyboardNavigation();
		const colorAccessibilityResult = await this.verifyColorAccessibility();
		
		allErrors.push(...tabOrderResult.errors);
		allErrors.push(...formLabelsResult.errors);
		allErrors.push(...headingHierarchyResult.errors);
		allErrors.push(...imageAltsResult.errors);
		allErrors.push(...keyboardNavigationResult.errors);
		allErrors.push(...colorAccessibilityResult.errors);
		
		return {
			success: allErrors.length === 0,
			summary: {
				tabOrder: tabOrderResult.success,
				formLabels: formLabelsResult.success,
				headingHierarchy: headingHierarchyResult.success,
				imageAlts: imageAltsResult.success,
				keyboardNavigation: keyboardNavigationResult.success,
				colorAccessibility: colorAccessibilityResult.success
			},
			errors: allErrors
		};
	}
}

/**
 * Constantes pour les standards WCAG
 */
export const WCAG_STANDARDS = {
	CONTRAST_RATIOS: {
		AA_NORMAL: 4.5,
		AA_LARGE: 3,
		AAA_NORMAL: 7,
		AAA_LARGE: 4.5
	},
	TARGET_SIZES: {
		MINIMUM: 44, // 44x44px minimum pour les cibles de clic
		RECOMMENDED: 48 // 48x48px recommande
	},
	LINE_HEIGHT: {
		MINIMUM: 1.5 // 1.5 fois la taille de police minimum
	}
};

/**
 * Selecteurs communs pour les tests d'accessibilite
 */
export const ACCESSIBILITY_SELECTORS = {
	FOCUSABLE: 'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
	FORM_CONTROLS: 'input, select, textarea',
	HEADINGS: 'h1, h2, h3, h4, h5, h6',
	IMAGES: 'img',
	CLICKABLE: 'button, [href], input[type="submit"], input[type="button"], [role="button"]',
	INTERACTIVE: 'button, [href], input, select, textarea, [role="button"], [role="link"], [role="textbox"]'
};
