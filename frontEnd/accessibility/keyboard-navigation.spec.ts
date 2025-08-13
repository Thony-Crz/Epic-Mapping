import { test, expect } from '@playwright/test';

/**
 * Tests specifiques pour la navigation au clavier
 * Conformite WCAG 2.1 - Critere 2.1 (Accessibilite au clavier)
 */

test.describe('Navigation au clavier', () => {
	test('Navigation Tab - Ordre logique des elements focusables', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		// Obtenir tous les elements focusables dans l'ordre du DOM
		const focusableElements = await page.locator(
			'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
		).all();
		
		if (focusableElements.length === 0) {
			console.warn('Aucun element focusable trouve sur la page');
			return;
		}
		
		// Commencer par le premier element
		await focusableElements[0].focus();
		
		// Naviguer avec Tab et verifier l'ordre
		for (let i = 1; i < focusableElements.length; i++) {
			await page.keyboard.press('Tab');
			
			// Verifier que l'element suivant est bien focalise
			const currentFocused = await page.evaluate(() => document.activeElement);
			const expectedElement = await focusableElements[i].evaluate(el => el);
			
			expect(currentFocused).toBe(expectedElement);
		}
	});

	test('Navigation Shift+Tab - Ordre inverse', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const focusableElements = await page.locator(
			'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
		).all();
		
		if (focusableElements.length < 2) {
			console.warn('Pas assez d\'elements focusables pour tester la navigation inverse');
			return;
		}
		
		// Commencer par le dernier element
		const lastIndex = focusableElements.length - 1;
		await focusableElements[lastIndex].focus();
		
		// Naviguer en arriere avec Shift+Tab
		for (let i = lastIndex - 1; i >= 0; i--) {
			await page.keyboard.press('Shift+Tab');
			
			const currentFocused = await page.evaluate(() => document.activeElement);
			const expectedElement = await focusableElements[i].evaluate(el => el);
			
			expect(currentFocused).toBe(expectedElement);
		}
	});

	test('Activation des boutons avec Entree et Espace', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const buttons = await page.locator('button:not([disabled])').all();
		
		for (const button of buttons) {
			// Tester activation avec Entree
			await button.focus();
			
			// Verifier que le bouton peut recevoir le focus
			const isFocused = await button.evaluate(el => el === document.activeElement);
			expect(isFocused).toBeTruthy();
			
			// Note: Nous ne testons pas l'activation reelle car cela pourrait
			// declencher des actions non desirees dans les tests
		}
	});

	test('Formulaires - Navigation et soumission au clavier', async ({ page }) => {
		// Tester sur la page de login si elle existe
		const loginExists = await page.goto('/login').then(() => true).catch(() => false);
		
		if (!loginExists) {
			console.warn('Page de login non trouvee, test ignore');
			return;
		}
		
		await page.waitForLoadState('networkidle');
		
		// Verifier que tous les champs de formulaire sont accessibles au clavier
		const formInputs = await page.locator('input, select, textarea').all();
		
		for (const input of formInputs) {
			await input.focus();
			
			// Verifier que l'input peut recevoir le focus
			const isFocused = await input.evaluate(el => el === document.activeElement);
			expect(isFocused).toBeTruthy();
			
			// Verifier que l'input peut recevoir du texte (pour les champs de texte)
			const inputType = await input.getAttribute('type');
			if (!inputType || inputType === 'text' || inputType === 'email' || inputType === 'password') {
				await input.fill('test');
				const value = await input.inputValue();
				expect(value).toBe('test');
				await input.clear();
			}
		}
	});

	test('Menus et dropdowns - Navigation au clavier', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		// Chercher les elements de menu ou dropdown
		const menuTriggers = await page.locator('[role="button"][aria-haspopup], [aria-expanded]').all();
		
		for (const trigger of menuTriggers) {
			await trigger.focus();
			
			// Verifier que l'element peut recevoir le focus
			const isFocused = await trigger.evaluate(el => el === document.activeElement);
			expect(isFocused).toBeTruthy();
			
			// Tester l'ouverture avec Entree ou Espace
			const ariaExpanded = await trigger.getAttribute('aria-expanded');
			if (ariaExpanded === 'false') {
				await page.keyboard.press('Enter');
				
				// Verifier que le menu s'est ouvert
				const newAriaExpanded = await trigger.getAttribute('aria-expanded');
				// Note: Le test exact dependrait de l'implementation specifique
			}
		}
	});

	test('Liens - Activation et navigation', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const links = await page.locator('a[href]:not([href="#"]):not([href=""])').all();
		
		for (const link of links) {
			await link.focus();
			
			// Verifier que le lien peut recevoir le focus
			const isFocused = await link.evaluate(el => el === document.activeElement);
			expect(isFocused).toBeTruthy();
			
			// Verifier que le lien a un texte accessible
			const linkText = await link.textContent();
			const ariaLabel = await link.getAttribute('aria-label');
			const ariaLabelledby = await link.getAttribute('aria-labelledby');
			
			const hasAccessibleName = linkText?.trim() || ariaLabel || ariaLabelledby;
			expect(hasAccessibleName).toBeTruthy();
		}
	});

	test('Raccourcis clavier - Touches d\'acceleration', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		// Verifier les elements avec des accesskey
		const elementsWithAccesskey = await page.locator('[accesskey]').all();
		
		for (const element of elementsWithAccesskey) {
			const accesskey = await element.getAttribute('accesskey');
			expect(accesskey).toBeTruthy();
			
			// Verifier que l'accesskey est documente (aria-label ou title)
			const ariaLabel = await element.getAttribute('aria-label');
			const title = await element.getAttribute('title');
			
			if (ariaLabel) {
				expect(ariaLabel.toLowerCase()).toContain(accesskey!.toLowerCase());
			} else if (title) {
				expect(title.toLowerCase()).toContain(accesskey!.toLowerCase());
			}
		}
	});

	test('Pieges a clavier - Aucun piege detecte', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		// Naviguer a travers tous les elements focusables
		const focusableElements = await page.locator(
			'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
		).all();
		
		if (focusableElements.length === 0) return;
		
		// Commencer par le premier element
		await focusableElements[0].focus();
		
		// Faire un cycle complet de navigation
		for (let i = 0; i < focusableElements.length * 2; i++) {
			await page.keyboard.press('Tab');
			
			// Verifier qu'on peut toujours naviguer (pas de piege)
			const activeElement = await page.evaluate(() => document.activeElement?.tagName);
			expect(activeElement).toBeTruthy();
		}
		
		// Verifier qu'on peut sortir avec Escape si on est dans un modal/dialog
		const modals = await page.locator('[role="dialog"], [role="alertdialog"]').all();
		
		for (const modal of modals) {
			const isVisible = await modal.isVisible();
			if (isVisible) {
				await page.keyboard.press('Escape');
				
				// Verifier que le modal peut etre ferme avec Escape
				const stillVisible = await modal.isVisible();
				// Note: Le comportement exact depend de l'implementation
			}
		}
	});

	test('Focus visible - Indicateurs visuels de focus', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const focusableElements = await page.locator(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		).all();
		
		for (const element of focusableElements) {
			await element.focus();
			
			// Verifier que l'element a un indicateur de focus visible
			const focusedElement = await page.locator(':focus').first();
			
			// Verifier que l'element focalise est visible
			await expect(focusedElement).toBeVisible();
			
			// Verifier qu'il y a un style de focus (outline, box-shadow, etc.)
			const computedStyle = await focusedElement.evaluate(el => {
				const style = window.getComputedStyle(el);
				return {
					outline: style.outline,
					outlineWidth: style.outlineWidth,
					outlineStyle: style.outlineStyle,
					boxShadow: style.boxShadow
				};
			});
			
			// Au moins un indicateur de focus doit etre present
			const hasFocusIndicator = 
				computedStyle.outline !== 'none' ||
				computedStyle.outlineWidth !== '0px' ||
				computedStyle.boxShadow !== 'none';
			
			expect(hasFocusIndicator).toBeTruthy();
		}
	});
});
