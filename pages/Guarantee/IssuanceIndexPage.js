const mainCodeInfo = require('../../fixture/gtIssuance/mainCodeInfo.json');
const { waitForResponse } = require('../../helper/apiHelper');

class Issuance {
    constructor(page) {
        this.page = page;
        this.branchCodePre = page.getByText(mainCodeInfo.branchCode).first();
        this.branchNamePre = page.locator('input[name="branchName"]')
        this.referenceModalSearchInput = page.locator('input[placeholder="Search Here"]').nth(1);
        this.SN = page.getByRole('cell', { name: '1' }).nth(0);
        this.mainCodeInput = page.locator('div').filter({ hasText: /^Select\.\.\.$/ }).nth(1);
        this.clientName = page.locator('input[name="name"]').first();
        this.referenceNumberInput = page.locator('input[name="referenceNo"]').first();
        this.addButton = page.locator('button[title="Add"]');
        this.resetButton = page.locator('button[title="Reset"]');
        this.SelectMainCode = page.getByTestId('dialog-element').getByRole('cell', { name: mainCodeInfo.mainCode });

        //Reference Modal Search Filter
        this.searchInputRefModal = page.locator('input[placeholder="Search Here"]').nth(1);
        this.dropDownRefMOdal = page.locator('.css-b0mvk-indicatorContainer').nth(1);
        this.comboBoxInputRefModal = page.locator('input[role="combobox"]').nth(1);


        //Search Filter
        this.openDropDown = page.locator('.css-b0mvk-indicatorContainer')
        this.searchInputForCombo = page.locator('input[role="combobox"]');

        this.searchInputFieldIndex = page.locator('input[placeholder="Search Here"]').nth(0);




        //Table Field
        this.deleteButton = page.locator('.text-red-700').first();
        this.deleteYesIamSure = page.getByText("Yes, I'm Sure");
        this.editIcon = page.locator('button[title="Edit"]').first();

        //Pagination
        this.selectPageSize = page.locator('select[data-testid="page-size-select"]');
        this.gotoPage = page.locator('input[type="number"]');
        this.moveToLastPageIcon = page.locator('button[data-testid="last-page"]');
        this.moveToFirstPageIcon = page.locator('button[data-testid="first-page"]');
        this.moveToNextPageIcon = page.locator('button[data-testid="next-page"]');
        this.moveToPreviousIcon = page.locator('button[type="button"]').nth(63);



        //No Data found
        this.noDataText = page.getByText('No Data');

    }

    async visitMainCodeModal() {
        await this.mainCodeInput.click();
        return await waitForResponse(this.page, '/api/common/getmaincodewithoutnominated');

    }

    async searchClient() {

        await Promise.all([
            waitForResponse(this.page, '/api/common/getmaincodewithoutnominated'),
            this.referenceModalSearchInput.fill(mainCodeInfo.clientID),
            this.referenceModalSearchInput.press('Enter')
        ])
    }

    async selectMainCodeMethod() {
        await this.SelectMainCode.click();
    }

    async clickAddButton() {
        await this.addButton.click();
    }

    async clickResetButton() {
        await this.resetButton.click();
    }

    //Search Filter Reference Modal

    async clickEditIcon(){
        await this.editIcon.click();
    }

    async moveDownRefModal() {
        await this.comboBoxInputRefModal.press('ArrowDown');
    }

    async clickDropDownRefModal() {
        await this.dropDownRefMOdal.click();
    }

    async searchByMainCodeRefModal() {
        await this.clickDropDownRefModal();
        await this.comboBoxInputRefModal.press('Enter');
    }


    async searchByClientNameRefModal() {
        await this.clickDropDownRefModal();
        await this.moveDownRefModal();
        await this.comboBoxInputRefModal.press('Enter');

    }

    //Search Filter Index

    async clickSearchFilterDropDown() {
        await this.openDropDown.click();
    }

    async pressDown() {
        await this.searchInputForCombo.press('ArrowDown');
    }

    async pressEnter() {
        await this.searchInputForCombo.press('Enter');
    }

    async selectSearchByMainCode() {
        await this.clickSearchFilterDropDown();
        await this.pressEnter();
    }

    async selectSearchByClientCode() {
        await this.clickSearchFilterDropDown();
        await this.pressDown();
        await this.pressEnter();
    }

    async selectSearchByClientName() {
        await this.clickSearchFilterDropDown();
        await this.pressDown();
        await this.pressDown();
        await this.pressEnter();
    }

    async selectSearchByACType() {
        await this.clickSearchFilterDropDown();
        await this.pressDown();
        await this.pressDown();
        await this.pressDown();
        await this.pressEnter();
    }

    async selectSearchByCYCode() {
        await this.clickSearchFilterDropDown();
        await this.pressDown();
        await this.pressDown();
        await this.pressDown();
        await this.pressDown();
        await this.pressEnter();
    }


    //Table Method
    async clickDeleteButton() {
        await this.deleteButton.click();
        await this.deleteYesIamSure.click();
    }

    //Pagination

    async selectPage10() {
        await this.selectPageSize.selectOption('10')


    }
    async selectPage50() {


        await Promise.all([
            waitForResponse(this.page, 'api/guarantee/issuance/list?branchCode=777&search=&skip=0&take=50'),
            this.selectPageSize.selectOption('50')
        ])
    }

    async selectPage100() {


        await this.selectPageSize.selectOption('100');

    }

    async gotoPage2() {
        await this.gotoPage.press('ArrowUp');
        return await waitForResponse(this.page, 'api/guarantee/issuance/list?')
    }


    async clickMoveToLastPageIcon() {
        await this.moveToLastPageIcon.click();
        return await waitForResponse(this.page, '/api/guarantee/issuance/list?')
    }

    async clickToFirstPageIcon() {
        await this.moveToLastPageIcon.click();
        await waitForResponse(this.page, '/api/guarantee/issuance/list?')


        // Wait until first page button is enabled
        await this.page.waitForSelector('button[data-testid="first-page"]:not([disabled])', { state: 'visible' });

        await this.moveToFirstPageIcon.click();
        await waitForResponse(this.page, '/api/guarantee/issuance/list?');
    }


    async clickMoveToNextPageIcon() {
        await this.moveToNextPageIcon.click();
        await waitForResponse(this.page, '/api/guarantee/issuance/')
    }

    async clickMoveToPreviousPage() {
        await this.moveToNextPageIcon.click();
        await waitForResponse(this.page, '/api/guarantee/issuance/list?branchCode=777&search=&skip=10&take=10')

        await this.page.waitForSelector(
            'button[type="button"]:has(svg polyline[points="160 208 80 128 160 48"])',
            { state: 'visible' }
        );


        await this.moveToPreviousIcon.click();
        await waitForResponse(this.page, '/api/guarantee/issuance/list?branchCode=777&search=&skip=0&take=10');
    }


    async clickEditIcon(){
        await this.editIcon.click();
    }



}


module.exports = Issuance;