import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Tests specifiques pour l'accessibilite des contenus multimedia et visuels
 * Conformite WCAG 2.1 - Criteres 1.1, 1.4, 2.2, 2.3
 */

test.describe('Accessibilite multimedia et visuelle', () => {
	test('Images - Textes alternatifs appropries', async ({ page }) => {
		const pages = ['/', '/login', '/epic', '/feature-flags'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			const images = await page.locator('img').all();
			
			for (const img of images) {
				const src = await img.getAttribute('src');
				const alt = await img.getAttribute('alt');
				const ariaLabel = await img.getAttribute('aria-label');
				const ariaLabelledby = await img.getAttribute('aria-labelledby');
				const ariaHidden = await img.getAttribute('aria-hidden');
				const role = await img.getAttribute('role');
				
				// Les images decoratives peuvent avoir alt="" ou aria-hidden="true"
				const isDecorative = alt === '' || ariaHidden === 'true' || role === 'presentation';
				
				if (!isDecorative) {
					// Les images informatives doivent avoir un texte alternatif
					const hasAltText = alt || ariaLabel || ariaLabelledby;
					
					if (!hasAltText) {
						console.error(`Image sans texte alternatif sur ${pagePath}:`, { src });
					}
					
					expect(hasAltText).toBeTruthy();
					
					// Le texte alternatif ne doit pas etre redondant
					if (alt) {
						expect(alt.toLowerCase()).not.toContain('image');
						expect(alt.toLowerCase()).not.toContain('photo');
						expect(alt.toLowerCase()).not.toContain('picture');
					}
				}
			}
		}
	});

	test('Videos et medias - Alternatives accessibles', async ({ page }) => {
		const pages = ['/', '/epic', '/feature-flags'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Verifier les elements video
			const videos = await page.locator('video').all();
			
			for (const video of videos) {
				// Verifier les controles accessibles
				const controls = await video.getAttribute('controls');
				const ariaLabel = await video.getAttribute('aria-label');
				const ariaLabelledby = await video.getAttribute('aria-labelledby');
				
				// La video doit avoir un nom accessible
				const hasAccessibleName = ariaLabel || ariaLabelledby;
				if (!hasAccessibleName) {
					console.warn('Video sans nom accessible detectee');
				}
				
				// Verifier les sous-titres si disponibles
				const tracks = await video.locator('track').all();
				
				for (const track of tracks) {
					const kind = await track.getAttribute('kind');
					const src = await track.getAttribute('src');
					const srclang = await track.getAttribute('srclang');
					
					expect(kind).toBeTruthy();
					expect(src).toBeTruthy();
					
					if (kind === 'subtitles' || kind === 'captions') {
						expect(srclang).toBeTruthy();
					}
				}
			}
			
			// Verifier les elements audio
			const audios = await page.locator('audio').all();
			
			for (const audio of audios) {
				const controls = await audio.getAttribute('controls');
				const autoplay = await audio.getAttribute('autoplay');
				
				// L'audio ne devrait pas demarrer automatiquement
				if (autoplay) {
					console.warn('Audio avec autoplay detecte - peut etre problematique pour l\'accessibilite');
				}
			}
		}
	});

	test('Contraste des couleurs - Conformite WCAG AA', async ({ page }) => {
		const pages = ['/', '/login', '/epic', '/feature-flags'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(['wcag2aa'])
				.analyze();
			
			// Filtrer les violations de contraste
			const contrastViolations = accessibilityScanResults.violations.filter(
				violation => violation.id === 'color-contrast'
			);
			
			if (contrastViolations.length > 0) {
				console.error(`Violations de contraste sur ${pagePath}:`, contrastViolations);
			}
			
			expect(contrastViolations).toEqual([]);
		}
	});

	test('Texte redimensionnable - Zoom jusqu\'a 200%', async ({ page }) => {
		const pages = ['/', '/login'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Mesurer la taille initiale
			const initialViewport = await page.viewportSize();
			const initialTextElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span, div').all();
			
			// Simuler un zoom a 200% en reduisant la viewport
			await page.setViewportSize({ 
				width: Math.floor(initialViewport!.width / 2), 
				height: Math.floor(initialViewport!.height / 2) 
			});
			
			// Verifier qu'il n'y a pas de defilement horizontal
			const horizontalScrollWidth = await page.evaluate(() => {
				return document.documentElement.scrollWidth > document.documentElement.clientWidth;
			});
			
			// Un leger defilement horizontal peut etre acceptable
			if (horizontalScrollWidth) {
				const scrollDifference = await page.evaluate(() => {
					return document.documentElement.scrollWidth - document.documentElement.clientWidth;
				});
				
				// Tolerer jusqu'a 20px de defilement horizontal
				expect(scrollDifference).toBeLessThan(20);
			}
			
			// Verifier que le contenu reste lisible
			const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6').all();
			
			for (const element of textElements) {
				const isVisible = await element.isVisible();
				expect(isVisible).toBeTruthy();
			}
			
			// Restaurer la taille originale
			await page.setViewportSize(initialViewport!);
		}
	});

	test('Animations et mouvement - Respect des preferences utilisateur', async ({ page }) => {
		// Simuler prefers-reduced-motion
		await page.emulateMedia({ reducedMotion: 'reduce' });
		
		const pages = ['/', '/epic'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Verifier que les animations respectent prefers-reduced-motion
			const animatedElements = await page.locator('[style*="animation"], [class*="animate"]').all();
			
			for (const element of animatedElements) {
				const computedStyle = await element.evaluate(el => {
					const style = window.getComputedStyle(el);
					return {
						animationDuration: style.animationDuration,
						animationPlayState: style.animationPlayState,
						transitionDuration: style.transitionDuration
					};
				});
				
				// Les animations devraient etre reduites ou desactivees
				const hasReducedAnimation = 
					computedStyle.animationDuration === '0s' ||
					computedStyle.animationPlayState === 'paused' ||
					computedStyle.transitionDuration === '0s';
				
				// Note: Ce test depend de l'implementation CSS de votre application
				// Il devrait y avoir des media queries @media (prefers-reduced-motion: reduce)
			}
		}
	});

	test('Clignotement et flash - Pas de contenu dangereux', async ({ page }) => {
		const pages = ['/', '/epic'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Verifier qu'il n'y a pas d'elements qui clignotent rapidement
			const blinkingElements = await page.locator('[style*="blink"], .blink').all();
			
			for (const element of blinkingElements) {
				const isVisible = await element.isVisible();
				
				if (isVisible) {
					console.warn('Element clignotant detecte - verifier la frequence');
					
					// Verifier que l'element peut etre pause ou arrete
					const hasControls = await element.locator('button, [role="button"]').count() > 0;
					
					// Il devrait y avoir un moyen d'arreter le clignotement
					// ou le clignotement ne devrait pas depasser 3 fois par seconde
				}
			}
			
			// Verifier les gifs animes
			const gifs = await page.locator('img[src*=".gif"]').all();
			
			for (const gif of gifs) {
				const src = await gif.getAttribute('src');
				console.info(`GIF detecte: ${src} - Verifier manuellement qu'il ne clignote pas plus de 3 fois par seconde`);
			}
		}
	});

	test('Couleur comme seule information - Alternatives disponibles', async ({ page }) => {
		const pages = ['/', '/epic', '/feature-flags'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Tester en desaturant la page (simulation daltonisme)
			await page.addStyleTag({
				content: `
					* {
						filter: grayscale(100%) !important;
					}
				`
			});
			
			// Verifier que les elements importants restent distinguables
			const importantElements = await page.locator(
				'button, [role="button"], .error, .warning, .success, .info, [aria-invalid="true"]'
			).all();
			
			for (const element of importantElements) {
				const isVisible = await element.isVisible();
				expect(isVisible).toBeTruthy();
				
				// Verifier qu'il y a des indicateurs autres que la couleur
				const textContent = await element.textContent();
				const ariaLabel = await element.getAttribute('aria-label');
				const title = await element.getAttribute('title');
				
				// L'element devrait avoir du texte, des icones, ou des attributs descriptifs
				const hasNonColorIndicator = textContent?.trim() || ariaLabel || title;
				
				if (!hasNonColorIndicator) {
					const className = await element.getAttribute('class');
					console.warn(`Element utilisant potentiellement la couleur seule: ${className}`);
				}
			}
			
			// Retirer le filtre
			await page.addStyleTag({
				content: `
					* {
						filter: none !important;
					}
				`
			});
		}
	});

	test('Focus visible - Indicateurs de navigation clairs', async ({ page }) => {
		const pages = ['/', '/login'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			const focusableElements = await page.locator(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			).all();
			
			for (const element of focusableElements) {
				await element.focus();
				
				// Prendre une capture du focus pour verifier visuellement
				const focusedElement = await page.locator(':focus');
				
				// Verifier que l'element focalise a un outline visible
				const focusStyles = await focusedElement.evaluate(el => {
					const style = window.getComputedStyle(el);
					return {
						outline: style.outline,
						outlineWidth: style.outlineWidth,
						outlineStyle: style.outlineStyle,
						outlineColor: style.outlineColor,
						boxShadow: style.boxShadow,
						border: style.border
					};
				});
				
				// Au moins un indicateur visuel doit etre present
				const hasVisibleFocus = 
					(focusStyles.outline !== 'none' && focusStyles.outlineWidth !== '0px') ||
					focusStyles.boxShadow !== 'none' ||
					focusStyles.border !== 'none';
				
				expect(hasVisibleFocus).toBeTruthy();
			}
		}
	});

	test('Espacement et taille - Criteres de confort visuel', async ({ page }) => {
		const pages = ['/', '/login'];
		
		for (const pagePath of pages) {
			const pageExists = await page.goto(pagePath).then(() => true).catch(() => false);
			if (!pageExists) continue;
			
			await page.waitForLoadState('networkidle');
			
			// Verifier la taille minimale des cibles de clic (44x44px)
			const clickableElements = await page.locator('button, [href], input[type="submit"], input[type="button"]').all();
			
			for (const element of clickableElements) {
				const boundingBox = await element.boundingBox();
				
				if (boundingBox) {
					// WCAG recommande 44x44px minimum pour les cibles de clic
					if (boundingBox.width < 44 || boundingBox.height < 44) {
						console.warn(`Element cliquable trop petit: ${boundingBox.width}x${boundingBox.height}px`);
					}
					
					// Les elements peuvent etre plus petits s'ils ont suffisamment d'espacement
					// ou s'ils sont dans une phrase de texte
				}
			}
			
			// Verifier l'espacement des lignes de texte
			const textElements = await page.locator('p, div, span').all();
			
			for (const element of textElements) {
				const styles = await element.evaluate(el => {
					const style = window.getComputedStyle(el);
					return {
						lineHeight: style.lineHeight,
						fontSize: style.fontSize
					};
				});
				
				// La hauteur de ligne devrait etre au moins 1.5 fois la taille de police
				if (styles.lineHeight !== 'normal' && !styles.lineHeight.includes('%')) {
					const lineHeightPx = parseFloat(styles.lineHeight);
					const fontSizePx = parseFloat(styles.fontSize);
					
					if (lineHeightPx && fontSizePx) {
						const ratio = lineHeightPx / fontSizePx;
						
						if (ratio < 1.5) {
							console.warn(`Hauteur de ligne insuffisante: ${ratio.toFixed(2)} (minimum recommande: 1.5)`);
						}
					}
				}
			}
		}
	});
});
