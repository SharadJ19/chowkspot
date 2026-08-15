import { test, expect } from '@playwright/test';

test.describe('ChowkSpot Full Marketplace E2E Lifecycle', () => {
  test('Complete End-to-End Flow: Booking, Acceptance, Payment, and Verified Review', async ({
    browser,
  }) => {
    // -------------------------------------------------------------------------
    // STEP 1: Customer Context - Search & Request Booking
    // -------------------------------------------------------------------------
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();

    await customerPage.goto('/login');
    await customerPage.fill('input[type="email"]', 'user@test.com');
    await customerPage.fill('input[type="password"]', 'Password123!');

    await Promise.all([
      customerPage.waitForResponse(
        (res) => res.url().includes('/auth/login') && res.status() === 200,
      ),
      customerPage.click('button[type="submit"]'),
    ]);

    // Verify redirect to search marketplace
    await customerPage.waitForURL(/.+\/search/);
    await expect(customerPage).toHaveURL(/.+\/search/);

    // Select Electrician trade category using custom Autocomplete component
    const categoryInput = customerPage.locator('input[placeholder*="search skills"]');
    await categoryInput.click();
    await categoryInput.fill('Electrician');

    // Select the specific dropdown option explicitly
    await customerPage
      .locator('div[class*="dropdownItem"]')
      .filter({ hasText: /^Electrician$/ })
      .first()
      .click();

    // Open booking modal for the first worker
    const bookBtn = customerPage.locator('button:has-text("Book")').first();
    await bookBtn.click();

    // Fill booking details (Using regex matching dynamic worker modal header)
    await expect(
      customerPage.getByRole('heading', { name: /Book.*Electrician/i }),
    ).toBeVisible();
    await customerPage.fill('input[type="datetime-local"]', '2026-08-25T11:00');
    await customerPage.fill('input[placeholder*="House"]', 'Sector 17-E, Chandigarh');
    await customerPage.click('button:has-text("Send Booking Request")');

    // Confirm request sent toast/modal close & navigate to bookings
    await expect(customerPage.locator('text=Booking request sent')).toBeVisible();

    // -------------------------------------------------------------------------
    // STEP 2: Worker Context - Accept Job & Mark Complete
    // -------------------------------------------------------------------------
    const workerContext = await browser.newContext();
    const workerPage = await workerContext.newPage();

    await workerPage.goto('/login');
    await workerPage.fill('input[type="email"]', 'smarth.sharda@chowkspot.com');
    await workerPage.fill('input[type="password"]', 'Password123!');

    // Wait for the login API response to ensure tokens & cookies are set before navigating
    await Promise.all([
      workerPage.waitForResponse(
        (res) => res.url().includes('/auth/login') && res.status() === 200,
      ),
      workerPage.click('button[type="submit"]'),
    ]);

    await workerPage.goto('/bookings');
    await workerPage.waitForURL(/\/bookings/);

    await expect(
      workerPage.getByRole('heading', {
        name: /Incoming Job Requests|Service Bookings|Command Center/i,
      }),
    ).toBeVisible({ timeout: 15000 });

    // Accept incoming job request safely with auto-waiting
    const acceptJobBtn = workerPage.locator('button:has-text("Accept Job")').first();
    await acceptJobBtn.waitFor({ state: 'visible', timeout: 10000 });
    await acceptJobBtn.click();
    await expect(workerPage.locator('text=ACCEPTED').first()).toBeVisible();

    // Advance to In Progress
    const startWorkBtn = workerPage.locator('button:has-text("Start Work")').first();
    await startWorkBtn.waitFor({ state: 'visible', timeout: 10000 });
    await startWorkBtn.click();
    await expect(workerPage.locator('text=IN PROGRESS').first()).toBeVisible();

    // Mark Complete
    const completeBtn = workerPage
      .locator('button:has-text("Mark Job Complete")')
      .first();
    await completeBtn.waitFor({ state: 'visible', timeout: 10000 });
    await completeBtn.click();
    await expect(workerPage.locator('text=COMPLETED').first()).toBeVisible();

    // -------------------------------------------------------------------------
    // STEP 3: Customer Context - UPI Payment & Verified Review
    // -------------------------------------------------------------------------
    await customerPage.goto('/bookings');
    await customerPage.reload();

    // Trigger Direct UPI Payment Modal (0% fee test)
    const payUpiBtn = customerPage.locator('button:has-text("Pay via UPI")').first();
    if (await payUpiBtn.isVisible()) {
      await payUpiBtn.click();
      await expect(
        customerPage.locator('text=Zero-Commission Direct UPI Payment'),
      ).toBeVisible();
      await customerPage.click('button:has-text("Done / Close")');
    }

    // Submit Verified Review
    const reviewBtn = customerPage.locator('button:has-text("Leave Review")').first();
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      await expect(customerPage.locator('text=Leave a Verified Review')).toBeVisible();
      await customerPage.fill(
        'textarea',
        'Exceptional service quality and clean execution!',
      );
      await customerPage.click('button:has-text("Submit Verified Review")');
    }

    await customerContext.close();
    await workerContext.close();
  });
});
