import { expect, test } from '@playwright/test';

test('editor visible', async ({ page }) => {
	await page.goto('/app');
	await expect(page.getByTestId('panel')).toBeVisible();
});

test('result text visible', async ({ page }) => {
	await page.goto('/app');
	await expect(page.getByTestId('result-text')).toBeVisible();
});

test('editor and result text resizing', async ({ page }) => {
	await page.goto('/app');
	await page.evaluate(() => localStorage.clear());
	const resultText = page.getByTestId('result-text');
	const editor = page.getByTestId('editor');
	const resizeResultText = page.getByTestId('resize-result-text');
	const resizeEditor = page.getByTestId('resize-editor');
	await resizeEditor.click();
	await expect(resultText).not.toBeInViewport();
	await resizeEditor.click();
	await expect(resultText).toBeInViewport();
	await resizeResultText.click();
	await expect(editor).not.toBeInViewport();
	await resizeResultText.click();
	await expect(editor).toBeInViewport();
});

test('editor and result text scroll', async ({ page }) => {
	await page.goto('/app');
	await page.evaluate(() => localStorage.clear());
	const editor = page.getByTestId('editor');
	const resultText = page.getByTestId('result-text');
	await page.getByTestId('new-note').click();
	await page.getByTestId('note').click();
	await editor.click();
	// Type 100 lines
	let longText = '';
	for (let i = 0; i < 100; i++) {
		longText += '\ntext';
	}
	await page.keyboard.type(longText);
	const scrollTop = await resultText.evaluate((el) => el.scrollTop);
	const scrollHeight = await resultText.evaluate((el) => el.scrollHeight);
	const clientHeight = await resultText.evaluate((el) => el.clientHeight);
	expect(scrollHeight - scrollTop).toBe(clientHeight);
	await resultText.focus();
	await page.mouse.wheel(0, -scrollHeight);
	await page.waitForTimeout(100);
	expect(await editor.evaluate((el) => el.scrollTop)).toBe(0);
});

test('note persists reload', async ({ page }) => {
	await page.goto('/app');
	await page.evaluate(() => localStorage.clear());
	const editor = page.getByTestId('editor');
	await page.getByTestId('new-note').click();
	await page.getByTestId('note').click();
	await editor.click();
	// Type 100 lines
	let longText = '';
	for (let i = 0; i < 100; i++) {
		longText += '\ntext';
	}
	await page.keyboard.type(longText);
	await page.reload();
	await expect(editor).toHaveValue(longText);
});

test('note persists selection switch', async ({ page }) => {
	await page.goto('/app');
	await page.evaluate(() => localStorage.clear());
	const editor = page.getByTestId('editor');
	await page.getByTestId('new-note').click();
	await page.getByTestId('note').click();
	await editor.click();
	// Type 100 lines
	let longText = '';
	for (let i = 0; i < 100; i++) {
		longText += '\ntext';
	}
	await page.keyboard.type(longText);
	await page.getByTestId('new-note').click();
	await page.getByTestId('note').nth(1).click();
	await page.getByTestId('note').nth(0).click();
	await expect(editor).toHaveValue(longText);
});
