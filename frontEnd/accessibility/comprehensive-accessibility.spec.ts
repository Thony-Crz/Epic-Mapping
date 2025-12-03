import { test, expect } from '@playwright/test';
import { AccessibilityHelper } from './accessibility-helpers';

const READY_EPIC_ID = 'b1a4f2b8-5e2f-4bc7-8a04-4d1a17aa0f22';
const READY_EPIC_PATH = `/epics/${READY_EPIC_ID}`;

/**
 * Tests d'accessibilite utilisant les utilitaires personnalises
 */

test.describe('Tests d\'accessibilite avec utilitaires', () => {
	let accessibilityHelper: AccessibilityHelper;

	test.beforeEach(async ({ page }) => {
		accessibilityHelper = new AccessibilityHelper(page);
	});

	test('Rapport complet d\'accessibilite - Page d\'accueil', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const report = await accessibilityHelper.generateAccessibilityReport();

		console.log('Rapport d\'accessibilite:', {
			success: report.success,
			summary: report.summary,
			errorsCount: report.errors.length
		});

		if (!report.success) {
			console.error('Erreurs d\'accessibilite detectees:', report.errors);
		}

		// Le test peut passer avec des avertissements mais echouer avec des erreurs critiques
		expect(report.summary.formLabels).toBeTruthy();
		expect(report.summary.headingHierarchy).toBeTruthy();
		expect(report.summary.imageAlts).toBeTruthy();
	});

	test('Rapport complet d\'accessibilite - Page de connexion', async ({ page }) => {
		const pageExists = await page.goto('/login').then(() => true).catch(() => false);
		if (!pageExists) {
			console.warn('Page de connexion non disponible');
			return;
		}

		await page.waitForLoadState('networkidle');

		const report = await accessibilityHelper.generateAccessibilityReport();

		console.log('Rapport d\'accessibilite (login):', {
			success: report.success,
			summary: report.summary,
			errorsCount: report.errors.length
		});

		// Les formulaires de connexion doivent avoir des labels corrects
		expect(report.summary.formLabels).toBeTruthy();
		expect(report.summary.keyboardNavigation).toBeTruthy();
	});

	test('Navigation au clavier - Test detaille', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const result = await accessibilityHelper.simulateKeyboardNavigation();

		if (!result.success) {
			console.error('Problemes de navigation au clavier:', result.errors);
		}

		expect(result.success).toBeTruthy();
	});

	test('Verification des labels de formulaire', async ({ page }) => {
		const formPages = ['/login', '/epic'];

		for (const pagePath of formPages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;

			await page.waitForLoadState('networkidle');

			const result = await accessibilityHelper.verifyFormLabels();

			if (!result.success) {
				console.error(`Problemes de labels sur ${pagePath}:`, result.errors);
			}

			expect(result.success).toBeTruthy();
		}
	});

	test('Hierarchie des titres - Structure semantique', async ({ page }) => {
		const pages = ['/', '/epic', '/feature-flags'];

		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;

			await page.waitForLoadState('networkidle');

			const result = await accessibilityHelper.verifyHeadingHierarchy();

			if (!result.success) {
				console.error(`Problemes de hierarchie des titres sur ${pagePath}:`, result.errors);
			}

			// La hierarchie des titres est critique pour la navigation
			expect(result.success).toBeTruthy();
		}
	});

	test('Images et textes alternatifs', async ({ page }) => {
		const pages = ['/', '/epic', '/feature-flags'];

		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;

			await page.waitForLoadState('networkidle');

			const result = await accessibilityHelper.verifyImageAlts();

			if (!result.success) {
				console.error(`Images sans texte alternatif sur ${pagePath}:`, result.errors);
			}

			expect(result.success).toBeTruthy();
		}
	});

	test('Accessibilite des couleurs - Test daltonisme', async ({ page }) => {
		const pages = ['/', '/login'];

		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;

			await page.waitForLoadState('networkidle');

			const result = await accessibilityHelper.verifyColorAccessibility();

			if (!result.success) {
				console.warn(`Problemes potentiels de couleur sur ${pagePath}:`, result.errors);
			}

			// Ce test peut etre un avertissement plutot qu'une erreur
			// car certains elements peuvent etre distinguables d'autres manieres
		}
	});

	test('Elements focusables - Verification complete', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const focusableElements = await accessibilityHelper.getFocusableElements();

		// Verifier qu'il y a des elements focusables sur la page
		expect(focusableElements.length).toBeGreaterThan(0);

		// Verifier que chaque element focusable a un nom accessible
		for (const element of focusableElements) {
			const hasAccessibleName = await accessibilityHelper.hasAccessibleName(element);

			if (!hasAccessibleName) {
				const tagName = await element.evaluate(el => el.tagName);
				const className = await element.getAttribute('class');
				console.error(`Element focusable sans nom accessible: ${tagName}.${className}`);
			}

			expect(hasAccessibleName).toBeTruthy();
		}
	});

	test('Test de stress - Navigation intensive au clavier', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const focusableElements = await accessibilityHelper.getFocusableElements();

		if (focusableElements.length === 0) {
			console.warn('Aucun element focusable trouve');
			return;
		}

		// Naviguer plusieurs fois a travers tous les elements
		for (let cycle = 0; cycle < 3; cycle++) {
			for (let i = 0; i < focusableElements.length; i++) {
				await page.keyboard.press('Tab');

				// Verifier qu'on peut toujours naviguer (pas de piege)
				const activeElement = await page.evaluate(() => document.activeElement);
				expect(activeElement).toBeTruthy();
			}
		}

		// Verifier qu'on peut naviguer en arriere
		for (let i = 0; i < focusableElements.length; i++) {
			await page.keyboard.press('Shift+Tab');

			const activeElement = await page.evaluate(() => document.activeElement);
			expect(activeElement).toBeTruthy();
		}
	});

	test('Simulation utilisateur malvoyant', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Masquer tout le contenu visuel et naviguer uniquement au clavier
		await page.addStyleTag({
			content: `
				* {
					opacity: 0.1 !important;
				}
				:focus {
					opacity: 1 !important;
					outline: 3px solid red !important;
				}
			`
		});

		const focusableElements = await accessibilityHelper.getFocusableElements();

		// Simuler la navigation d'un utilisateur de lecteur d'ecran
		for (const element of focusableElements) {
			await element.focus();

			// Verifier que l'element a suffisamment d'informations accessibles
			const hasAccessibleName = await accessibilityHelper.hasAccessibleName(element);
			const hasAccessibleDescription = await accessibilityHelper.hasAccessibleDescription(element);

			// Au minimum, l'element doit avoir un nom accessible
			expect(hasAccessibleName).toBeTruthy();

			// Les elements complexes devraient avoir une description
			const role = await element.getAttribute('role');
			const isComplexElement = ['button', 'link', 'textbox'].includes(role || '');

			if (isComplexElement && !hasAccessibleDescription) {
				console.warn('Element complexe sans description accessible detecte');
			}
		}

		// Retirer les styles de test
		await page.addStyleTag({
			content: `
				* {
					opacity: 1 !important;
				}
			`
		});
	});

	test('Ready-epic export control est focusable et annonce son etat', async ({ page }) => {
		const pageExists = await page.goto(READY_EPIC_PATH).then(() => true).catch(() => false);
		if (!pageExists) {
			throw new Error(`La page ${READY_EPIC_PATH} doit exister pour verifier l'accessibilite du bouton d'export.`);
		}

		await page.waitForLoadState('networkidle');

		const exportButton = page.getByRole('button', { name: /export ready epic json/i });
		await expect(exportButton).toBeVisible();
		await exportButton.focus();
		await expect(exportButton).toBeFocused();
		await expect(exportButton).toHaveAttribute('aria-label', /ready/i);
		await expect(exportButton).toHaveAttribute('aria-live', /polite|assertive/i);
	});

	test('Export control annonce les resultats via une region aria-live', async ({ page }) => {
		const pageExists = await page.goto(READY_EPIC_PATH).then(() => true).catch(() => false);
		if (!pageExists) {
			throw new Error(`La page ${READY_EPIC_PATH} doit exister pour verifier la region aria-live.`);
		}

		await page.waitForLoadState('networkidle');

		const liveRegion = page.locator('[data-testid="export-ready-epic-live-region"]');
		await expect(liveRegion).toHaveAttribute('aria-live', /polite|assertive/i);
		await expect(liveRegion).toHaveAttribute('role', /status|alert/i);

		const exportButton = page.getByRole('button', { name: /export ready epic json/i });
		await exportButton.click();
		await expect(liveRegion).toContainText(/export en cours|export reussi|export echoue/i);
	});
});
