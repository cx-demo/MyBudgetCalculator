import { test, expect } from '@playwright/test';

test.describe('Budget Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Budget Calculator/);
  });

  test('displays initial zero values', async ({ page }) => {
    await expect(page.locator('#total-income')).toHaveText('$0.00');
    await expect(page.locator('#total-expenses')).toHaveText('$0.00');
    await expect(page.locator('#remaining-budget')).toHaveText('$0.00');
  });

  test('can add income', async ({ page }) => {
    await page.fill('#income-description', 'Salary');
    await page.fill('#income-amount', '5000');
    await page.click('#add-income-btn');

    await expect(page.locator('#total-income')).toHaveText('$5000.00');
    await expect(page.locator('#remaining-budget')).toHaveText('$5000.00');
    await expect(page.locator('#income-list')).toContainText('Salary');
  });

  test('can add expense', async ({ page }) => {
    await page.fill('#expense-description', 'Rent');
    await page.fill('#expense-amount', '1500');
    await page.click('#add-expense-btn');

    await expect(page.locator('#total-expenses')).toHaveText('$1500.00');
    await expect(page.locator('#remaining-budget')).toHaveText('$-1500.00');
    await expect(page.locator('#expense-list')).toContainText('Rent');
  });

  test('calculates remaining budget correctly', async ({ page }) => {
    // Add income
    await page.fill('#income-description', 'Salary');
    await page.fill('#income-amount', '5000');
    await page.click('#add-income-btn');

    // Add expense
    await page.fill('#expense-description', 'Rent');
    await page.fill('#expense-amount', '1500');
    await page.click('#add-expense-btn');

    await expect(page.locator('#total-income')).toHaveText('$5000.00');
    await expect(page.locator('#total-expenses')).toHaveText('$1500.00');
    await expect(page.locator('#remaining-budget')).toHaveText('$3500.00');
  });

  test('can delete income item', async ({ page }) => {
    // Add income
    await page.fill('#income-description', 'Salary');
    await page.fill('#income-amount', '5000');
    await page.click('#add-income-btn');

    await expect(page.locator('#total-income')).toHaveText('$5000.00');

    // Delete the income item
    await page.click('#income-list .delete-btn');

    await expect(page.locator('#total-income')).toHaveText('$0.00');
    await expect(page.locator('#income-list')).not.toContainText('Salary');
  });

  test('can delete expense item', async ({ page }) => {
    // Add expense
    await page.fill('#expense-description', 'Rent');
    await page.fill('#expense-amount', '1500');
    await page.click('#add-expense-btn');

    await expect(page.locator('#total-expenses')).toHaveText('$1500.00');

    // Delete the expense item
    await page.click('#expense-list .delete-btn');

    await expect(page.locator('#total-expenses')).toHaveText('$0.00');
    await expect(page.locator('#expense-list')).not.toContainText('Rent');
  });

  test('shows validation error for empty fields', async ({ page }) => {
    // Set up dialog handler
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Please enter a valid description and amount');
      await dialog.accept();
    });

    // Click add income without filling fields
    await page.click('#add-income-btn');
  });
});
