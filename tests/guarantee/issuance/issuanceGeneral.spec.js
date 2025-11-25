const { test, expect } = require('@playwright/test')
const issuanceInformation = require('../../../pages/Guarantee/IssuanceInformation')
const login = require('../../../pages/Login/LoginPage')
const issuanceIndex = require('../../../pages/Guarantee/IssuanceIndexPage');
const issuanceGeneral = require('../../../pages/Guarantee/IssuanceGeneral');
const mainCodeInfo = require('../../../fixture/gtIssuance/mainCodeInfo.json');
const loginCredential = require('../../../fixture/login/loginCredential.json');
const { referenceGenerator } = require('../../../helper/referenceGenerator');
const generalColumnData = require('../../../fixture/gtIssuance/generalColumnData.json');
const { getFutureDate } = require('../../../helper/futureDateHelper');


let clientGuaranteeAmount;
let generalPage;
let informationPage;
let issuancePage
let loginPage;
test.beforeEach(async ({ page }) => {
    generalPage = new issuanceGeneral(page);
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

    //Creating new issuance
    // const uniqueReferenceNo = referenceGenerator();

    // await issuancePage.visitMainCodeModal();
    // await issuancePage.searchClient();
    // await issuancePage.selectMainCodeMethod();
    // await issuancePage.referenceNumberInput.fill(uniqueReferenceNo);
    // await issuancePage.addButton.click();
    // await expect(page.locator('label', { hasText: "Guarantee Inserted successfully" })).toBeVisible();

    //Click Issuance tab
    // await page.locator('a[data-tooltip-id="sidebar-title"]').nth(2).click();
    // await page.waitForTimeout(500);

    // Search Specific client to navigate to Information tab
    await issuancePage.searchInputFieldIndex.fill(generalColumnData.referenceNumber);
    await issuancePage.searchInputFieldIndex.press("Enter");
    const refNo = generalColumnData.referenceNumber;
    await expect(page.getByRole('cell', { name: refNo })).toContainText(generalColumnData.referenceNumber);


    //Now clicking to edit page to navigate to information tab
    await issuancePage.clickEditIcon();

    //Clicking information Tab
    await informationPage.clickInformationTab();
    clientGuaranteeAmount = await informationPage.availableBalance.inputValue();

    await generalPage.clickGeneralTab();


})

test('Visibility Test of General Tab', async ({ page }) => {
    await expect(generalPage.generalTab).toBeVisible();
    await expect(generalPage.cyCode).toBeVisible();
    await expect(generalPage.cyDesc).toBeVisible();
    await expect(generalPage.guaranteeAmount).toBeVisible();
    await expect(generalPage.exchangeRate).toBeVisible();
    await expect(generalPage.lcyEquivalent).toBeDisabled();
    await expect(generalPage.issueDate).toBeDisabled()
    await expect(generalPage.valueDate).toBeVisible();
    await expect(generalPage.expiryDate).toBeVisible();
    await expect(generalPage.claimDate).toBeVisible();
    await expect(generalPage.contraAc).toBeVisible()
    await expect(generalPage.contraAcName).toBeDisabled();

    const storeWord = await generalPage.contraAcName.inputValue();
    console.log(storeWord);

    const [word] = await storeWord.match(/.+/)
    await expect(generalPage.contraAcName).toHaveValue(word);

})

test('Issu_Genral_001, Verify Guarantee Currency Code auto-fetch', async ({ page }) => {
    const cyCode = await generalPage.cyCode.inputValue();
    await expect(generalPage.cyCode).toHaveValue(cyCode);

})

test('Issu_Genral_001, Verify Guarantee Cy Desc auto-fetch', async ({ page }) => {
    const cyDesc = await generalPage.cyDesc.inputValue();
    await expect(generalPage.cyDesc).toHaveValue(cyDesc);

})

test.only('Issu_Genral_001, Verify Guarantee Amount accepts positive numeric', async ({ page }) => {
  
    const amountDynamic = clientGuaranteeAmount; //just choose amount dynamic to make dynamic but make sure see Aung amount and minus as much you can
    console.log(amountDynamic)
    const amountHardCoded = generalColumnData.guaranteeAmount;
    await generalPage.fillGuaranteeAmount(String(amountHardCoded));



    //Optional but mandaotory
    //Enter Rate
    const rate = generalColumnData.exchnageRate
    await generalPage.fillExchangeRate(String(rate));


    //LCY Equivalance

    const calLCYAmt = String(amountHardCoded* rate)
    await expect(generalPage.lcyEquivalent).toHaveValue(calLCYAmt);


    //IssueDate
    const todayDate = getFutureDate(0);
    console.log(todayDate)
    // await expect(generalPage.issueDate).toHaveValue(todayDate);

    //Value Date
    await generalPage.clickValueDate();
    await generalPage.clickNextMonth();
    await generalPage.selectValueDay();


    // //Expiry Date
    await generalPage.clickExpiryDate();
    await generalPage.clickNextMonth();
    await generalPage.selectExpiryDay();

    // //claim Date
    await generalPage.clickClaimDate();
    await generalPage.clickNextMonth();
    await generalPage.selectClaimDay();

    await page.waitForTimeout(10000);

    //Execute or Press Click&Save
    await generalPage.clickNextAndSaveButton();
    await expect(page.getByText('Guarantee Updated successfully.')).toBeVisible();




})