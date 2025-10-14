const { test, expect } = require('@playwright/test');
const IssuancePage = require('../pages/Guarantee/IssuanceIndexPage');
const LoginPage = require('../pages/Login/LoginPage');
const loginCredential = require('../loginCredential.json');
const mainCodeInfo = require('../mainCodeInfo.json');
const { referenceGenerator } = require('../helper/referenceGenerator')


let issuancePage;
let loginPage;
test.beforeEach(async ({ page }) => {
    issuancePage = new IssuancePage(page);
    loginPage = new LoginPage(page);
    await loginPage.visitLoginPage();
    await loginPage.loginToUser(loginCredential.userName, loginCredential.password, loginCredential.branch);
    await page.waitForLoadState('domcontentloaded');

    //Click Guarantee tab
    await page.locator('button[data-testid="collapseHead"]').nth(2).click();

    //Click Issuance tab
    await page.locator('a[data-tooltip-id="sidebar-title"]').nth(2).click();




})

test('Issuance page visibility test', async ({ page }) => {
    await expect(issuancePage.branchCodePre).toBeVisible();
    await expect(issuancePage.branchNamePre).toBeVisible();
    await expect(issuancePage.mainCodeInput).toHaveCount(1);
    await expect(issuancePage.clientName).toBeDisabled();
    await expect(issuancePage.referenceNumberInput).toBeEnabled();
    await expect(issuancePage.addButton).toBeVisible();


    //Count Delete button in table field
    const countDeleteButton = await issuancePage.deleteButton.count();
    console.log(`this is count ${countDeleteButton}`);



})

test('Issu_Form_001, Verify Branch code auto-populates based on logged-in user’s branch.', async ({ page }) => {
    await expect(issuancePage.branchCodePre).toContainText(mainCodeInfo.branchCode);
})

test('Issu_Form_002, Verify Branch code is read-only (cannot edit', async ({ page }) => {
    await expect(issuancePage.branchCodePre).toHaveClass(/cursor-not-allowed/);
})

test('Issu_Form_003,Verify Branch Name auto-populates based on Branch code.', async ({ page }) => {
    await expect(issuancePage.branchNamePre).toHaveValue(mainCodeInfo.branchName);
})

test('Issu_Form_004, Verify Branch Name is read-only', async ({ page }) => {
    await expect(issuancePage.branchNamePre).toBeDisabled();
})

test('Issu_Form_005, Verify Main Code field opens a popup table when clicked.', async ({ page }) => {
    await issuancePage.visitMainCodeModal();
    await expect(page.getByRole('heading', { name: 'Select Options' })).toBeVisible();

})

test('Issu_Form_006, Verify popup table shows correct columns → A/c Type, Currency Code, Main Code, Client ID, Name.', async ({ page }) => {
    await issuancePage.visitMainCodeModal();
    await expect(page.getByRole('heading', { name: 'Main Code' }).nth(1)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Client ID' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Name' }).nth(1)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ac Type' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cy Code' }).nth(1)).toBeVisible();
})

test('Issu_Form_006, Verify popup table filters based on selected Branch Code.', async ({ page }) => {
    await issuancePage.visitMainCodeModal();
    const response = await page.waitForResponse(res => res.url().includes('/api/guarantee/issuance/GetMainCodeList?branchCode=777&AcTypeSubType=G&search=&columnName=clientCode&skip=0&take=10') && res.ok())

    const json = await response.json();
    expect(json).toHaveProperty('data');
    expect(json.data).toHaveProperty('list');
    expect(Array.isArray(json.data.list)).toBe(true);

    for (const item of json.data.list) {
        expect(item.branchCode).toBe(mainCodeInfo.branchCode);
    }
})

test('Issu_Form_007, Verify user can select Main Code from popup.', async ({ page }) => {
    await issuancePage.visitMainCodeModal();
    const firstRow = page.locator('table tr').first();
    await expect(firstRow).toBeVisible();

    const mainCodeCell = page.getByRole('cell', { name: mainCodeInfo.mainCode }).first();

    await expect(mainCodeCell).toBeVisible();
})

test('Issu_Form_008, Verify Reference Number allows alphanumeric and symbols (e.g., BG123$, BG-Test-01).', async ({ page }) => {

    const uniqueReferenceNo = referenceGenerator();

    await issuancePage.visitMainCodeModal();
    await issuancePage.selectMainCodeMethod();
    await issuancePage.referenceNumberInput.fill(uniqueReferenceNo);
    await issuancePage.addButton.click();
    await expect(page.locator('label', { hasText: "Guarantee Inserted successfully" })).toBeVisible();

})

test('Issu_Form_008, Verify Reference Number cannot exceed 20 characters.', async ({ page }) => {
    await issuancePage.referenceNumberInput.fill('1234567891234025648222');
    await expect(page.getByText('Reference number must be less than 20 characters')).toBeVisible();
})




