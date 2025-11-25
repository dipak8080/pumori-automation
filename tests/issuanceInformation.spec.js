const {test, expect} = require('@playwright/test')
const issuanceInformation = require('../pages/Guarantee/IssuanceInformation')
const login = require('../pages/Login/LoginPage')
const issuanceIndex = require('../pages/Guarantee/IssuanceIndexPage');
const mainCodeInfo = require('../mainCodeInfo.json');
const loginCredential = require('../loginCredential.json')


let informationPage;
let issuancePage
let loginPage;
test.beforeEach(async({page})=>{
    informationPage = new issuanceInformation(page);
    issuancePage = new issuanceIndex(page);
    loginPage = new login(page);

    await loginPage.visitLoginPage();
    await loginPage.loginToUser(loginCredential.userName, loginCredential.password, loginCredential.branch);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    //Click Guarantee tab
    await page.locator('button[data-testid="collapseHead"]').nth(2).click();
    await page.waitForTimeout(500);

    //Click Issuance tab
    await page.locator('a[data-tooltip-id="sidebar-title"]').nth(2).click();
    await page.waitForTimeout(500);

    //Search Specific client to navigate to Information tab
    await issuancePage.searchInputFieldIndex.fill(" " + mainCodeInfo.referenceNo);
    await issuancePage.searchInputFieldIndex.press("Enter");
    const refNo = mainCodeInfo.referenceNo;
    await expect(page.getByRole('cell', { name: refNo })).toContainText(mainCodeInfo.referenceNo);

    //Now clicking to edit page to navigate to information tab
    await issuancePage.clickEditIcon();
    await informationPage.clickInformationTab();
})

test('Verify Information Visibility Test', async()=>{
    await expect (informationPage.informationTab).toBeVisible();
    await expect(informationPage.availableBalance).toBeDisabled();
})