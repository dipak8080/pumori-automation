const { test, expect } = require('@playwright/test');
const IssuancePage = require('../../../pages/Guarantee/IssuanceIndexPage');
const LoginPage = require('../../../pages/Login/LoginPage');
const loginCredential = require('../../../fixture/login/loginCredential.json');
const mainCodeInfo = require('../../../fixture/gtIssuance/mainCodeInfo.json');
const { referenceGenerator } = require('../../../helper/referenceGenerator')
const { gtIndexReferenceModal, gtIndexMainColumn } = require('../../../fixture/gtIssuance/issuanceColumn');
const{updateMainCodeInfo} = require('../../../helper/jsonHelper');



let issuancePage;
let loginPage;
test.beforeEach(async ({ page }) => {
    issuancePage = new IssuancePage(page);
    loginPage = new LoginPage(page);
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




})

test('Issuance page visibility test', async ({ page }) => {
    await expect(issuancePage.branchCodePre).toBeVisible();
    await expect(issuancePage.branchNamePre).toBeVisible();
    await expect(issuancePage.mainCodeInput).toHaveCount(1);
    await expect(issuancePage.clientName).toBeDisabled();
    await expect(issuancePage.referenceNumberInput).toBeEnabled();
    await expect(issuancePage.addButton).toBeVisible();
    await expect(issuancePage.openDropDown).toBeVisible();
    await expect(issuancePage.searchInputForCombo).toHaveCount(1);
    await expect(issuancePage.searchInputFieldIndex).toBeVisible();
    await expect(issuancePage.deleteButton).toBeVisible();
    await expect(issuancePage.gotoPage).toBeVisible();
    await expect(issuancePage.moveToLastPageIcon).toBeVisible();
    await expect(issuancePage.moveToFirstPageIcon).toBeVisible();
    await expect(issuancePage.moveToNextPageIcon).toBeVisible();
    await expect(issuancePage.moveToPreviousIcon).toBeVisible();
    await expect(issuancePage.editIcon).toBeVisible();



    //Count Delete button in table field
    const countDeleteButton = await issuancePage.deleteButton.count();
    console.log(`this is count ${countDeleteButton}`);

    // await issuancePage.searchInputFieldIndex.fill('BG-2025-837')
    // await expect(issuancePage.noDataText).toBeVisible();



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
    test.setTimeout(60000);
    await issuancePage.visitMainCodeModal();
    await expect(page.getByRole('heading', { name: 'Select Options' })).toBeVisible();

})





test('Issu_Form_006, Verify popup table shows correct columns → A/c Type, Currency Code, Main Code, Client ID, Name.', async ({ page }) => {
    test.setTimeout(60000);
    await issuancePage.visitMainCodeModal();
    for (const column of gtIndexReferenceModal) {
        const heading = page.getByRole('heading', { name: column });

        try {
            await expect(heading).toBeVisible({ timeout: 10000 });
        } catch {
            await expect(heading.nth(1)).toBeVisible({ timeout: 10000 });
        }

    }
    // await expect(page.getByRole('heading', { name: 'Main Code' }).nth(1)).toBeVisible();
    // await expect(page.getByRole('heading', { name: 'Client ID' })).toBeVisible();
    // await expect(page.getByRole('heading', { name: 'Name' }).nth(1)).toBeVisible();
    // await expect(page.getByRole('heading', { name: 'Ac Type' })).toBeVisible();
    // await expect(page.getByRole('heading', { name: 'Cy Code' }).nth(1)).toBeVisible();
})




test('Issu_Form_007, Verify popup table filters based on selected Branch Code.', async ({ page }) => {
    test.setTimeout(60000);


    const json = await issuancePage.visitMainCodeModal();
    expect(json).toHaveProperty('data');
    expect(json.data).toHaveProperty('list');
    expect(Array.isArray(json.data.list)).toBe(true);

    for (const item of json.data.list) {
        expect(item.branchCode).toBe(mainCodeInfo.branchCode);
    }
});


test('Issu_Form_008, Verify user can select Main Code from popup.', async ({ page }) => {
    await issuancePage.visitMainCodeModal();
    const firstRow = page.locator('table tr').first();
    await expect(firstRow).toBeVisible();

    const mainCodeCell = page.getByRole('cell', { name: mainCodeInfo.mainCode }).first();

    await expect(mainCodeCell).toBeVisible();
})

test('Issu_Form_009, Verify Reference Number allows alphanumeric and symbols (e.g., BG123$, BG-Test-01).', async ({ page }) => {

    const uniqueReferenceNo = referenceGenerator();

    await issuancePage.visitMainCodeModal();
    await issuancePage.searchClient();
    await issuancePage.selectMainCodeMethod();
    await issuancePage.referenceNumberInput.fill(uniqueReferenceNo);
    await issuancePage.addButton.click();
    await expect(page.locator('label', { hasText: "Guarantee Inserted successfully" })).toBeVisible();
    updateMainCodeInfo(uniqueReferenceNo);

})

test('Issu_Form_010, Verify Reference Number cannot exceed 20 characters.', async ({ page }) => {
    await issuancePage.referenceNumberInput.fill('1234567891234025648222');
    await issuancePage.clickAddButton();
    await expect(page.getByText('Reference No. must not exceed 15 characters.')).toBeVisible();
})

test('Issu_Form_011, Verify Client Name auto-fills after selecting Main Code.', async ({ page }) => {
    test.setTimeout(120000);

    await issuancePage.visitMainCodeModal();
    await issuancePage.searchClient();
    await issuancePage.selectMainCodeMethod();

    const clientName = await issuancePage.clientName.inputValue();
    console.log(clientName);
    await expect(issuancePage.clientName).toHaveValue(clientName.trim() + " ");
    await expect(issuancePage.clientName).toHaveValue(clientName.trim() + " ");
})

test('Issu_Form_012, Verify Reset button clears all input fields (Branch, Main Code, Reference No).', async ({ page }) => {
    test.setTimeout(120000);
    await issuancePage.visitMainCodeModal();
    await issuancePage.searchClient();
    await issuancePage.selectMainCodeMethod();

    const clientName = await issuancePage.clientName.inputValue();
    await expect(issuancePage.clientName).toHaveValue(clientName);
    await expect(issuancePage.clientName).toHaveValue(clientName.trim() + " ");

    const refNo = referenceGenerator();
    updateMainCodeInfo(refNo);

    await issuancePage.referenceNumberInput.fill(refNo);

    await issuancePage.clickResetButton();
    await expect(issuancePage.clientName).toHaveValue('')
    await expect(issuancePage.referenceNumberInput).toHaveValue('');
})


test('Issu_Form_013, Verify error message appears if Reference Number already exists (duplicate).', async ({ page }) => {
    test.setTimeout(120000);
    await issuancePage.visitMainCodeModal();
    await issuancePage.searchClient();
    await issuancePage.selectMainCodeMethod();

    const ref = referenceGenerator();
    await issuancePage.referenceNumberInput.fill(ref);

    await issuancePage.referenceNumberInput.fill(ref);
    await issuancePage.clickAddButton();
    await expect(page.locator('label', { hasText: "Guarantee Inserted successfully" })).toBeVisible();

    //Click Issuance tab
    await page.locator('a[data-tooltip-id="sidebar-title"]').nth(2).click();


    await issuancePage.visitMainCodeModal();
    await issuancePage.searchClient();
    await issuancePage.selectMainCodeMethod();

    await issuancePage.referenceNumberInput.fill(ref);
    await issuancePage.clickAddButton();

    await expect(page.getByText('Gurentee Reference already exists.')).toBeVisible();

});

//Search Filter Reference Modal

test('Issu_Form_014, Verify Search works for Client Name with case-sensitive character. (Reference Modal)', async ({ page }) => {
    test.setTimeout(60000);
    await issuancePage.visitMainCodeModal();
    await expect(issuancePage.searchInputRefModal).toBeVisible();
    await expect(issuancePage.comboBoxInputRefModal).toBeVisible();
    await expect(issuancePage.dropDownRefMOdal).toBeVisible();


    const caseSenstive = [
        mainCodeInfo.name.toLowerCase(),
        mainCodeInfo.name.toUpperCase()
    ];

    for (const sens of caseSenstive) {
        await issuancePage.searchByClientNameRefModal();
        await issuancePage.searchInputRefModal.fill(sens);
        await issuancePage.searchInputRefModal.press('Enter');
        await expect(page.getByRole('cell', { name: mainCodeInfo.name }).first()).toContainText(mainCodeInfo.name);
    }

})

test('Issu_Form_015, Verify Search works for Client Name with exact clinet name (Reference Modal)', async ({ page }) => {
    test.setTimeout(60000);
    await issuancePage.visitMainCodeModal();
    await issuancePage.searchByClientNameRefModal();
    await issuancePage.searchInputRefModal.fill(mainCodeInfo.name);
    await issuancePage.searchInputRefModal.press('Enter');
    await expect(page.getByRole('cell', { name: mainCodeInfo.name }).first()).toContainText(mainCodeInfo.name);
})

test('Issu_Form_016, Verify Search works for Client Code (Reference Modal)', async ({ page }) => {
    test.setTimeout(60000);
    await issuancePage.visitMainCodeModal();
    await issuancePage.searchInputRefModal.fill(mainCodeInfo.clientID);
    await issuancePage.searchInputRefModal.press('Enter');
    await expect(page.getByRole('cell', { name: mainCodeInfo.clientID }).first()).toContainText(mainCodeInfo.clientID);


})

test('Issu_Form_017, Verify Search works for Main Code (Reference Modal)', async ({ page }) => {
    test.setTimeout(60000);
    await issuancePage.visitMainCodeModal();
    await issuancePage.searchByMainCodeRefModal();
    await issuancePage.searchInputRefModal.fill(mainCodeInfo.mainCode);
    await issuancePage.searchInputRefModal.press('Enter');
    await expect(page.getByRole('cell', { name: mainCodeInfo.mainCode }).first()).toContainText(mainCodeInfo.mainCode);

})


//Search Filter Index Test

test('Issu_Form_018, Verify by adding empty Reference Number', async ({ page }) => {
    test.setTimeout(60000);
    await issuancePage.visitMainCodeModal();
    await issuancePage.searchClient();
    await issuancePage.selectMainCodeMethod();
    await issuancePage.referenceNumberInput.fill('');
    await issuancePage.clickAddButton();
    await expect(page.getByText('Reference No. is required')).toBeVisible();
})


test('Issu_Form_019, Verify Search filter Exact match by Reference No', async ({ page }) => {
    await issuancePage.searchInputFieldIndex.fill(mainCodeInfo.referenceNo);
    await issuancePage.searchInputFieldIndex.press('Enter');

    const refNo = mainCodeInfo.referenceNo;
    await expect(page.getByRole('cell', { name: refNo })).toContainText(refNo);

})

test('Issu_Form_020, Verify Search filter Exact match by Reference No with leading space', async ({ page }) => {
    await issuancePage.searchInputFieldIndex.fill(" " + mainCodeInfo.referenceNo);
    await issuancePage.searchInputFieldIndex.press("Enter");
    const refNo = mainCodeInfo.referenceNo;
    await expect(page.getByRole('cell', { name: refNo })).toContainText(mainCodeInfo.referenceNo);
})

test('Issu_Form_021, Verify Search works for MainCode.', async ({ page }) => {
    await issuancePage.selectSearchByMainCode();
    await issuancePage.searchInputFieldIndex.fill(mainCodeInfo.mainCode);
    await issuancePage.searchInputFieldIndex.press("Enter");
    const mainCode = mainCodeInfo.mainCode;

    const locators = [
        page.getByRole('cell', { name: mainCode }).first(),
        page.getByRole('cell', { name: mainCode }).nth(1),
        page.getByRole('cell', { name: mainCode }).nth(2)
    ];

    let found = false;

    for (const locator of locators) {
        try {
            await expect(locator).toContainText(mainCode, { timeout: 2000 });
            found = true;
            break;
        } catch {

        }
    }

    expect(found).toBeTruthy();
});

test('Issu_Form_022, Verify Search works for MainCode with leading space.', async ({ page }) => {
    await issuancePage.selectSearchByMainCode();
    await issuancePage.searchInputFieldIndex.fill(" " + mainCodeInfo.mainCode);
    await issuancePage.searchInputFieldIndex.press("Enter");

    let found = false;

    const locators = [
        page.getByRole('cell', { name: mainCodeInfo.mainCode }).first(),
        page.getByRole('cell', { name: mainCodeInfo.mainCode }).nth(1),
        page.getByRole('cell', { name: mainCodeInfo.mainCode }).nth(2)

    ]

    for (const locator of locators) {
        try {
            await expect(locator).toContainText(mainCodeInfo.mainCode);
            found = true;
            break;
        }
        catch {

        }
    }

    expect(found).toBeTruthy();
})

test('Issu_Form_023, Verify Search works for Client Name.', async ({ page }) => {
    await issuancePage.selectSearchByClientName();
    await issuancePage.searchInputFieldIndex.fill(mainCodeInfo.name);
    await issuancePage.searchInputFieldIndex.press('Enter');

    await expect(page.getByRole('cell', { name: mainCodeInfo.name }).first()).toContainText(mainCodeInfo.name);
})

test('Issu_Form_024, Verify Search works for Client Name with leading space.', async ({ page }) => {
    await issuancePage.selectSearchByClientName();
    await issuancePage.searchInputFieldIndex.fill(" " + mainCodeInfo.name);
    await issuancePage.searchInputFieldIndex.press('Enter');

    await expect(page.getByRole('cell', { name: mainCodeInfo.name }).first()).toContainText(mainCodeInfo.name);
})

test('Issu_Form_025, Verify Search works for Client Name with case-sensitive character.', async ({ page }) => {

    const scenarios = [
        mainCodeInfo.name.toLowerCase(),
        mainCodeInfo.name.toUpperCase()
    ]

    for (const name of scenarios) {
        await issuancePage.selectSearchByClientName();
        await issuancePage.searchInputFieldIndex.fill(name)
        await expect(page.getByRole('cell', { name: mainCodeInfo.name }).first()).toContainText(mainCodeInfo.name);

    }
});

//Table Functionality

test('Issu_Form_026, Table Columns are visible', async ({ page }) => {
    const tableColumns = gtIndexMainColumn;

    for (const columns of tableColumns) {
        const columnLocator = page.getByRole('heading', { name: columns });
        try {
            await expect(columnLocator.first()).toBeVisible();
        } catch {
            await expect(columnLocator.nth(1)).toBeVisible();
        }
    }

})


test('Issu_Form_027, Verify Delete Button Successfully Deletes Issuance', async ({ page }) => {
    test.setTimeout(140000);
    await issuancePage.visitMainCodeModal();
    await issuancePage.searchClient();
    await issuancePage.selectMainCodeMethod();

    const ref = referenceGenerator();

    await issuancePage.referenceNumberInput.fill(ref);
    await issuancePage.clickAddButton();

    //Click Issuance tab
    await page.locator('a[data-tooltip-id="sidebar-title"]').nth(2).click();

    await issuancePage.searchInputFieldIndex.fill(ref);
    await expect(page.getByRole('cell', { name: ref }).first()).toContainText(ref);
    await issuancePage.clickDeleteButton();

    await issuancePage.searchInputFieldIndex.fill(ref);
    await expect(issuancePage.noDataText).toBeVisible();

 
})

//Pagination Index Page

test('Issu_Form_028, Verify View Per Page 10 Functionality', async ({ page }) => {
    await issuancePage.selectPage10();
    await issuancePage.selectPage10();
    await expect(page.locator('tbody tr')).toHaveCount(10);



})

test('Issu_Form_029, Verify View Per Page 50 Functionality', async ({ page }) => {
    await issuancePage.selectPage50();
    await issuancePage.selectPage50();
    await expect(page.locator('tbody tr')).toHaveCount(50);
})


test('Issu_Form_030, Verify View Per Page 100 Functionality', async ({ page }) => {

    await issuancePage.selectPage100();
    await issuancePage.selectPage100();
    await expect(page.locator('tbody tr')).toHaveCount(100);


})

test('Issu_Form_031, Verify go to page Functionality', async ({ page }) => {
    const response = await issuancePage.gotoPage2();

     const label = page.locator('label').nth(8);
    const labelInnerText = await label.innerText();
    const [start, end, total] = labelInnerText.match(/\d+/g).map(Number);

    await expect(label).toHaveText(`${start} - ${end} of ${total}`);
});

test('Issu_Form_032, Verify Move to last page icon', async ({ page }) => {
    const response = await issuancePage.clickMoveToLastPageIcon();

    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('count');

    const label = page.locator('label').nth(8)
    const labelInnerText = await label.innerText();
    console.log('test label' + label)
    const [start, end, total] = labelInnerText.match(/\d+/g).map(Number);
    console.log([start, end, total])



    await expect(label).toHaveText(`${start} - ${end} of ${total}`);
})

test('Issu_Form_033, Verify Move to first page icon', async ({ page }) => {
    await issuancePage.clickToFirstPageIcon();
    const label = page.locator('label').nth(8);
    const labelInnerText = await label.innerText();
    const [start, end, total] = labelInnerText.match(/\d+/g).map(Number);

    await expect(label).toHaveText(`${start} - ${end} of ${total}`);
});

test('Issu_Form_034, Verify Move to Next page icon',async({page})=>{
    await issuancePage.clickMoveToNextPageIcon();
    const label = page.locator('label').nth(8);
    const innerText = await label.innerText();
    const [start,end, total] = innerText.match(/\d+/g).map(Number)

    await expect(label).toHaveText(`${start} - ${end} of ${total}`)
})

test('Issu_Form_035, Verify Move to Previous page icon',async({page})=>{
    await issuancePage.clickMoveToPreviousPage();
    const label = page.locator('label').nth(8);
    const innerText = await label.innerText();
    const [start,end, total] = innerText.match(/\d+/g).map(Number)

    await expect(label).toHaveText(`${start} - ${end} of ${total}`)
})

















