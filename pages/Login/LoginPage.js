class Login{
    constructor(page){
        this.page = page;
        this.userNameInput = page.locator('input[name="userId"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.branchInput = page.locator('input[name="branchCode"]');
        this.loginButton = page.locator('button[type="submit"]');
    }

    async visitLoginPage(){
        await this.page.goto('/login',{waitUntill:'documentloaded'});
        await this.userNameInput.waitFor({state:'visible',timeout:10000});
    }

    async loginToUser(userName, password, branch){
        await this.userNameInput.fill(userName);
        await this.passwordInput.fill(password);
        await this.branchInput.fill(branch);
        await this.loginButton.click();
    }
}

module.exports= Login;