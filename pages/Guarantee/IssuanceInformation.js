class IssuanceInformation{

    constructor(page){
            this.page = page;
            this.informationTab = page.locator('ol li').first();
            this.availableBalance = page.locator('input[name="availBaln"]')
    }


    async clickInformationTab(){
        await this.informationTab.click();
    }


}
module.exports = IssuanceInformation;