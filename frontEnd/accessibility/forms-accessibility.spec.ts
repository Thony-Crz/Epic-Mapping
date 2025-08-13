import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Tests specifiques pour l'accessibilite des formulaires
 * Conformite WCAG 2.1 - Criteres 1.3, 2.4, 3.2, 3.3
 */

test.describe('Accessibilite des formulaires', () => {
	test('Labels - Tous les champs ont des labels appropries', async ({ page }) => {
		const formPages = ['/', '/login', '/epic'];
		
		for (const pagePath of formPages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			const formControls = await page.locator('input, select, textarea').all();
			
			for (const control of formControls) {
				const controlId = await control.getAttribute('id');
				const ariaLabel = await control.getAttribute('aria-label');
				const ariaLabelledby = await control.getAttribute('aria-labelledby');
				const placeholder = await control.getAttribute('placeholder');
				
				// Verifier qu'il y a un label explicite
				let hasExplicitLabel = false;
				
				if (controlId) {
					const explicitLabel = await page.locator(`label[for="${controlId}"]`).count();
					hasExplicitLabel = explicitLabel > 0;
				}
				
				// Verifier qu'il y a un label implicite (input dans label)
				let hasImplicitLabel = false;
				const parentLabel = await control.locator('xpath=ancestor::label').count();
				hasImplicitLabel = parentLabel > 0;
				
				// Au moins une forme de label doit etre presente
				const hasAccessibleName = hasExplicitLabel || hasImplicitLabel || ariaLabel || ariaLabelledby;
				
				if (!hasAccessibleName) {
					console.error(`Champ sans label accessible sur ${pagePath}:`, {
						id: controlId,
						type: await control.getAttribute('type'),
						placeholder: placeholder
					});
				}
				
				expect(hasAccessibleName).toBeTruthy();
			}
		}
	});

	test('Messages d\'erreur - Accessibles et associes aux champs', async ({ page }) => {
		await page.goto('/login');
		await page.waitForLoadState('networkidle');
		
		// Soumettre le formulaire sans donnees pour declencher les erreurs
		const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
		
		if (await submitButton.count() > 0) {
			await submitButton.click();
			
			// Attendre que les messages d'erreur apparaissent
			await page.waitForTimeout(500);
			
			// Verifier que les messages d'erreur sont accessibles
			const errorMessages = await page.locator('[role="alert"], .error, [aria-live="polite"], [aria-live="assertive"]').all();
			
			for (const errorMessage of errorMessages) {
				// Verifier que le message d'erreur est visible
				await expect(errorMessage).toBeVisible();
				
				// Verifier que le message a du contenu
				const textContent = await errorMessage.textContent();
				expect(textContent?.trim()).toBeTruthy();
			}
			
			// Verifier que les champs en erreur sont marques avec aria-invalid
			const invalidFields = await page.locator('[aria-invalid="true"]').all();
			
			for (const field of invalidFields) {
				// Verifier que le champ a une description d'erreur
				const ariaDescribedby = await field.getAttribute('aria-describedby');
				
				if (ariaDescribedby) {
					const errorDescription = await page.locator(`#${ariaDescribedby}`).textContent();
					expect(errorDescription?.trim()).toBeTruthy();
				}
			}
		}
	});

	test('Instructions et descriptions - Clairement associees', async ({ page }) => {
		const formPages = ['/', '/login', '/epic'];
		
		for (const pagePath of formPages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Verifier les champs avec aria-describedby
			const fieldsWithDescription = await page.locator('[aria-describedby]').all();
			
			for (const field of fieldsWithDescription) {
				const describedby = await field.getAttribute('aria-describedby');
				const descriptionIds = describedby!.split(' ');
				
				for (const id of descriptionIds) {
					const descriptionElement = await page.locator(`#${id}`).count();
					expect(descriptionElement).toBeGreaterThan(0);
					
					// Verifier que la description a du contenu
					const descriptionText = await page.locator(`#${id}`).textContent();
					expect(descriptionText?.trim()).toBeTruthy();
				}
			}
		}
	});

	test('Groupes de champs - Fieldsets et legends', async ({ page }) => {
		const formPages = ['/', '/login', '/epic'];
		
		for (const pagePath of formPages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Verifier les groupes de boutons radio
			const radioGroups = await page.locator('input[type="radio"]').all();
			const radioNames = new Set();
			
			for (const radio of radioGroups) {
				const name = await radio.getAttribute('name');
				if (name) radioNames.add(name);
			}
			
			// Chaque groupe de radio devrait etre dans un fieldset avec legend
			for (const name of radioNames) {
				const radiosInGroup = await page.locator(`input[type="radio"][name="${name}"]`).all();
				
				if (radiosInGroup.length > 1) {
					// Verifier qu'il y a un fieldset ou un role="group"
					const firstRadio = radiosInGroup[0];
					const fieldset = await firstRadio.locator('xpath=ancestor::fieldset').count();
					const roleGroup = await firstRadio.locator('xpath=ancestor::*[@role="group"]').count();
					
					expect(fieldset > 0 || roleGroup > 0).toBeTruthy();
				}
			}
			
			// Verifier que tous les fieldsets ont des legends
			const fieldsets = await page.locator('fieldset').all();
			
			for (const fieldset of fieldsets) {
				const legend = await fieldset.locator('legend').count();
				expect(legend).toBeGreaterThan(0);
				
				// Verifier que la legend a du contenu
				const legendText = await fieldset.locator('legend').textContent();
				expect(legendText?.trim()).toBeTruthy();
			}
		}
	});

	test('Validation en temps reel - Accessible', async ({ page }) => {
		await page.goto('/login');
		await page.waitForLoadState('networkidle');
		
		const inputFields = await page.locator('input[type="email"], input[type="password"], input[required]').all();
		
		for (const field of inputFields) {
			// Saisir une valeur invalide
			await field.focus();
			await field.fill('invalid');
			await field.blur();
			
			// Attendre la validation
			await page.waitForTimeout(500);
			
			// Verifier si des messages de validation apparaissent
			const ariaDescribedby = await field.getAttribute('aria-describedby');
			const ariaInvalid = await field.getAttribute('aria-invalid');
			
			if (ariaInvalid === 'true' && ariaDescribedby) {
				// Verifier que le message d'erreur existe et est accessible
				const errorMessage = await page.locator(`#${ariaDescribedby}`).textContent();
				expect(errorMessage?.trim()).toBeTruthy();
			}
			
			// Nettoyer pour le test suivant
			await field.clear();
		}
	});

	test('Formulaires complexes - Navigation et structure', async ({ page }) => {
		// Tester sur la page epic si elle contient des formulaires complexes
		const pageExists = await page.goto('/epic').then(() => true).catch(() => false);
		if (!pageExists) {
			console.warn('Page /epic non disponible, test ignore');
			return;
		}
		
		await page.waitForLoadState('networkidle');
		
		// Verifier la structure semantique du formulaire
		const forms = await page.locator('form').all();
		
		for (const form of forms) {
			// Verifier que le formulaire a un nom accessible
			const formName = await form.getAttribute('aria-label') || 
							await form.getAttribute('aria-labelledby') ||
							await form.locator('h1, h2, h3, h4, h5, h6').first().textContent();
			
			expect(formName?.trim()).toBeTruthy();
			
			// Verifier l'ordre de tabulation logique
			const focusableElements = await form.locator(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			).all();
			
			// Les elements doivent etre dans un ordre logique
			if (focusableElements.length > 1) {
				for (let i = 0; i < focusableElements.length; i++) {
					await focusableElements[i].focus();
					
					// Verifier que l'element peut recevoir le focus
					const isFocused = await focusableElements[i].evaluate(
						el => el === document.activeElement
					);
					expect(isFocused).toBeTruthy();
				}
			}
		}
	});

	test('Controles personnalises - Accessibilite ARIA', async ({ page }) => {
		const pages = ['/', '/epic', '/feature-flags'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Verifier les controles avec des roles ARIA
			const customControls = await page.locator(
				'[role="button"], [role="checkbox"], [role="radio"], [role="slider"], [role="spinbutton"], [role="switch"], [role="textbox"]'
			).all();
			
			for (const control of customControls) {
				const role = await control.getAttribute('role');
				
				// Verifier que le controle a un nom accessible
				const ariaLabel = await control.getAttribute('aria-label');
				const ariaLabelledby = await control.getAttribute('aria-labelledby');
				const textContent = await control.textContent();
				
				const hasAccessibleName = ariaLabel || ariaLabelledby || textContent?.trim();
				expect(hasAccessibleName).toBeTruthy();
				
				// Verifier les proprietes ARIA specifiques selon le role
				switch (role) {
					case 'checkbox':
					case 'radio':
					case 'switch':
						const ariaChecked = await control.getAttribute('aria-checked');
						expect(['true', 'false', 'mixed']).toContain(ariaChecked);
						break;
						
					case 'slider':
						const ariaValuenow = await control.getAttribute('aria-valuenow');
						const ariaValuemin = await control.getAttribute('aria-valuemin');
						const ariaValuemax = await control.getAttribute('aria-valuemax');
						expect(ariaValuenow).toBeTruthy();
						expect(ariaValuemin).toBeTruthy();
						expect(ariaValuemax).toBeTruthy();
						break;
						
					case 'textbox':
						// Les textbox peuvent avoir aria-multiline
						const ariaMultiline = await control.getAttribute('aria-multiline');
						if (ariaMultiline) {
							expect(['true', 'false']).toContain(ariaMultiline);
						}
						break;
				}
				
				// Verifier que le controle peut recevoir le focus
				await control.focus();
				const isFocused = await control.evaluate(el => el === document.activeElement);
				expect(isFocused).toBeTruthy();
			}
		}
	});

	test('Auto-completion et suggestions - Accessibles', async ({ page }) => {
		const formPages = ['/', '/login', '/epic'];
		
		for (const pagePath of formPages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Verifier les champs avec autocomplete
			const autocompleteFields = await page.locator('[autocomplete], [list]').all();
			
			for (const field of autocompleteFields) {
				const autocomplete = await field.getAttribute('autocomplete');
				const list = await field.getAttribute('list');
				
				if (autocomplete) {
					// Verifier que la valeur autocomplete est valide
					const validAutocomplete = [
						'on', 'off', 'name', 'email', 'username', 'current-password',
						'new-password', 'given-name', 'family-name', 'street-address',
						'postal-code', 'country', 'tel', 'url'
					];
					expect(validAutocomplete).toContain(autocomplete);
				}
				
				if (list) {
					// Verifier que la datalist existe
					const datalist = await page.locator(`#${list}`).count();
					expect(datalist).toBeGreaterThan(0);
					
					// Verifier que la datalist a des options
					const options = await page.locator(`#${list} option`).count();
					expect(options).toBeGreaterThan(0);
				}
			}
			
			// Verifier les suggestions avec aria-expanded et aria-owns
			const fieldsWithSuggestions = await page.locator('[aria-expanded], [aria-owns]').all();
			
			for (const field of fieldsWithSuggestions) {
				const ariaExpanded = await field.getAttribute('aria-expanded');
				const ariaOwns = await field.getAttribute('aria-owns');
				
				if (ariaExpanded) {
					expect(['true', 'false']).toContain(ariaExpanded);
				}
				
				if (ariaOwns) {
					// Verifier que l'element reference existe
					const ownedElement = await page.locator(`#${ariaOwns}`).count();
					expect(ownedElement).toBeGreaterThan(0);
				}
			}
		}
	});
});
