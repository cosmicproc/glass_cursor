import { expect, test } from '@playwright/test';
import os from 'os';
const platform = os.platform();
let systemNewTabKey: string;
if (platform === 'darwin') {
	systemNewTabKey = 'Meta';
} else {
	systemNewTabKey = 'Control';
}

test('panel visible', async ({ page }) => {
	await page.goto('/app');
	await expect(page.getByTestId('panel')).toBeVisible();
});

test('no notes message visible', async ({ page }) => {
	await page.goto('/app');
	await page.evaluate(() => localStorage.clear());
	await expect(page.getByTestId('no-notes')).toBeVisible();
});

test('new note', async ({ page }) => {
	await page.goto('/app');
	const oldCount = await page.getByTestId('note').count();
	await page.getByTestId('new-note').click();
	expect(await page.getByTestId('note').count()).toBeGreaterThan(oldCount);
});

test('select notes', async ({ page }) => {
	await page.goto('/app');
	// Create 10 notes
	await page.evaluate(() => localStorage.clear());
	for (let i = 0; i < 10; i++) {
		await page.getByTestId('new-note').click();
	}
	for (const note of await page.getByTestId('note').all()) {
		await note.click();
		const ids: string = (await note.getAttribute('id')) || '';
		expect('current-note' in ids.split(' '));
	}
});

test('rename notes', async ({ page }) => {
	await page.goto('/app');
	// Create 10 notes
	await page.evaluate(() => localStorage.clear());
	for (let i = 0; i < 10; i++) {
		await page.getByTestId('new-note').click();
	}
	for (const note of await page.getByTestId('note').all()) {
		const renameTo = 'Renamed Note';
		await note.getByTestId('rename').click();
		await page.keyboard.press(systemNewTabKey + '+A');
		await page.keyboard.press('Backspace');
		await page.keyboard.type(renameTo);
		const boundingBox = (await note.boundingBox()) || { x: 0, y: 0 };
		await page.mouse.click(boundingBox.x + 10, boundingBox.y + 10);
		const textContent: string = (await note.textContent()) || '';
		expect(textContent.trim()).toEqual(renameTo);
	}
});

test('delete notes', async ({ page }) => {
	await page.goto('/app');
	// Create 4 notes
	await page.evaluate(() => localStorage.clear());
	for (let i = 0; i < 4; i++) {
		await page.getByTestId('new-note').click();
	}
	for (const note of await page.getByTestId('note').all()) {
		await note.getByTestId('delete').click();
		await page.getByTestId('delete-confirm').click();
	}
	await page.waitForTimeout(500);
	expect(await page.getByTestId('note').count()).toEqual(0);
});

test('collapse panel', async ({ page }) => {
	await page.goto('/app');
	await page.evaluate(() => localStorage.clear());
	const panel = page.getByTestId('panel-aside');
	await page.getByTestId('toggle-panel').click();
	await expect(panel).not.toBeInViewport();
	await page.getByTestId('toggle-panel').click();
	await expect(panel).toBeInViewport();
});

test('change theme', async ({ page }) => {
	await page.goto('/app');
	await page.evaluate(() => localStorage.clear());
	await page.getByTestId('settings-button').click();
	await page.getByTestId('theme-select').selectOption('dark');
	expect(await page.locator('html').getAttribute('class')).toBe('dark');
	await page.keyboard.press('Escape');
	await page.getByTestId('settings-button').click();
	await page.getByTestId('theme-select').selectOption('light');
	expect(await page.locator('html').getAttribute('class')).toBe('');
	await page.keyboard.press('Escape');
	await page.getByTestId('settings-button').click();
	await page.getByTestId('theme-select').selectOption('auto');
	expect(await page.locator('html').getAttribute('class')).toBe('');
	await page.keyboard.press('Escape');
});
