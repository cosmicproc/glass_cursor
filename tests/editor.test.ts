import { expect, test } from '@playwright/test';

test('editor visible', async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByTestId('panel')).toBeVisible();
});

test('note persists reload', async ({ page }) => {
    await page.goto('/app');
    await page.evaluate(() => localStorage.clear());
    const editor = page.getByTestId('editor');
    await page.getByTestId('new-note').click();
    await page.getByTestId('note').click();
    await editor.click();
    const initialText = await editor.innerText();
    let longText = '';
    for (let i = 0; i < 100; i++) {
        longText += 'text';
    }
    await page.keyboard.type(longText);
    await page.reload();
    await page.waitForTimeout(500);
    expect(await editor.innerText()).toBe(initialText + longText);
});

test('note persists switching notes', async ({ page }) => {
    await page.goto('/app');
    await page.evaluate(() => localStorage.clear());
    // Create 2 notes
    for (let i = 0; i < 2; i++) {
        await page.getByTestId('new-note').click();
    }
    const editor = page.getByTestId('editor');
    await page.getByTestId('note').first().click();
    await editor.click();
    const initialText = await editor.innerText();
    let longText = '';
    for (let i = 0; i < 100; i++) {
        longText += 'text';
    }
    await page.keyboard.type(longText);
    await page.getByTestId('note').nth(1).click();
    await page.getByTestId('note').first().click();
    expect(await editor.innerText()).toBe(initialText + longText);
});
