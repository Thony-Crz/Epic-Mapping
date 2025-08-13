import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Tests d'accessibilite globaux selon les standards WCAG 2.1 AA
 */

test.describe('Tests accessibilite WCAG', () => {
	test('Page accueil - Conformite WCAG 2.1 AA', async ({ page }) => {
		await page.goto('/');
		
		// Attendre que la page soit completement chargee
		await page.waitForLoadState('networkidle');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		
		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Page de connexion - Conformite WCAG 2.1 AA', async ({ page }) => {
		await page.goto('/login');
		await page.waitForLoadState('networkidle');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		
		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Navigation au clavier - Toutes les pages accessibles', async ({ page }) => {
		const pages = ['/', '/login', '/epic', '/feature-flags'];
		
		for (const pagePath of pages) {
			await page.goto(pagePath);
			await page.waitForLoadState('networkidle');
			
			// Verifier que tous les elements interactifs sont accessibles au clavier
			const focusableElements = await page.locator(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			).all();
			
			for (const element of focusableElements) {
				await element.focus();
				const isFocused = await element.evaluate(el => el === document.activeElement);
				expect(isFocused).toBeTruthy();
			}
		}
	});

	test('Contraste des couleurs - Conformite WCAG AA', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.include('[data-testid="main-content"]')
			.analyze();
		
		// Verifier specifiquement les violations de contraste
		const contrastViolations = accessibilityScanResults.violations.filter(
			violation => violation.id === 'color-contrast'
		);
		
		expect(contrastViolations).toEqual([]);
	});

	test('Images et medias - Textes alternatifs requis', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		// Verifier que toutes les images ont un attribut alt
		const images = await page.locator('img').all();
		
		for (const img of images) {
			const altText = await img.getAttribute('alt');
			const ariaLabel = await img.getAttribute('aria-label');
			const ariaLabelledby = await img.getAttribute('aria-labelledby');
			
			// Une image doit avoir soit alt, soit aria-label, soit aria-labelledby
			expect(
				altText !== null || ariaLabel !== null || ariaLabelledby !== null
			).toBeTruthy();
		}
	});

	test('Formulaires - Labels et descriptions accessibles', async ({ page }) => {
		const formPages = ['/login', '/epic'];
		
		for (const pagePath of formPages) {
			await page.goto(pagePath);
			await page.waitForLoadState('networkidle');
			
			// Verifier que tous les champs de formulaire ont des labels
			const formControls = await page.locator('input, select, textarea').all();
			
			for (const control of formControls) {
				const id = await control.getAttribute('id');
				const ariaLabel = await control.getAttribute('aria-label');
				const ariaLabelledby = await control.getAttribute('aria-labelledby');
				
				// Verifier qu'il y a un label associe
				let hasLabel = false;
				
				if (id) {
					const label = await page.locator(`label[for="${id}"]`).count();
					hasLabel = label > 0;
				}
				
				hasLabel = hasLabel || ariaLabel !== null || ariaLabelledby !== null;
				
				expect(hasLabel).toBeTruthy();
			}
		}
	});

	test('Hierarchie des titres - Structure semantique correcte', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
		const headingLevels: number[] = [];
		
		for (const heading of headings) {
			const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
			const level = parseInt(tagName.substring(1));
			headingLevels.push(level);
		}
		
		// Verifier qu'il y a au moins un h1
		expect(headingLevels).toContain(1);
		
		// Verifier que la hierarchie est logique (pas de saut de niveau)
		for (let i = 1; i < headingLevels.length; i++) {
			const currentLevel = headingLevels[i];
			const previousLevel = headingLevels[i - 1];
			
			// Un titre ne peut pas etre plus de 1 niveau au-dessus du precedent
			expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
		}
	});

	test('Support des technologies d\'assistance', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa'])
			.include('main')
			.analyze();
		
		// Verifier les regles specifiques aux lecteurs d'ecran
		const ariaViolations = accessibilityScanResults.violations.filter(
			violation => violation.id.includes('aria') || violation.id.includes('role')
		);
		
		expect(ariaViolations).toEqual([]);
	});

	test('Accessibilite responsive - Zoom jusqu\'a 200%', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		
		// Simuler un zoom a 200%
		await page.setViewportSize({ width: 640, height: 480 });
		
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.analyze();
		
		expect(accessibilityScanResults.violations).toEqual([]);
		
		// Verifier qu'il n'y a pas de defilement horizontal
		const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
		const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
		
		expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1); // +1 pour les approximations de pixel
	});
});
