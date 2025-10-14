const mainCodeInfo = require('../../mainCodeInfo.json');

class Issuance{
    constructor(page){
        this.page = page;
        this.branchCodePre = page.getByText(mainCodeInfo.branchCode).first();
        this.branchNamePre = page.locator('input[name="branchName"]')
        this.mainCodeInput = page.locator('div').filter({ hasText: /^Select\.\.\.$/ }).nth(1);
        this.clientName = page.locator('input[name="name"]').first();
        this.referenceNumberInput = page.locator('input[name="referenceNo"]').first();
        this.addButton = page.locator('button[title="Add"]');
        this.resetButton = page.locator('button[title="Reset"]');
        this.SelectMainCode = page.getByTestId('dialog-element').getByRole('cell', { name: mainCodeInfo.mainCode });


        //Table Field
        this.deleteButton = page.locator('.text-red-700'); 
      
    }

        async visitMainCodeModal(){
            await this.mainCodeInput.click();
        }

        async selectMainCodeMethod(){
            await this.SelectMainCode.click();
        }

     


    }


module.exports = Issuance;