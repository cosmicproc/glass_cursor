import { expect, test } from '@playwright/test';

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
    await page.evaluate(() => localStorage.clear());
    // Create 10 notes
    for (let i = 0; i < 10; i++) {
        await page.getByTestId('new-note').click();
    }
    for (const note of await page.getByTestId('note').all()) {
        await note.click();
        const ids: string = (await note.getAttribute('id')) || '';
        expect('current-note' in ids.split(' '));
    }
});

test('delete notes', async ({ page }) => {
    await page.goto('/app');
    await page.evaluate(() => localStorage.clear());
    // Create 4 notes
    for (let i = 0; i < 4; i++) {
        await page.getByTestId('new-note').click();
    }
    for (let i = 0; i < 4; i++) {
        const note = page.getByTestId('note').first();
        await note.getByTestId('delete').click();
        await page.getByTestId('delete-confirm').click();
    }
    await page.waitForTimeout(1000);
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
