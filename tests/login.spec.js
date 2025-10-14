const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/Login/LoginPage')
const loginCredential = require('../loginCredential.json');

let loginPage;

test.beforeEach(async({page})=>{
    loginPage = new LoginPage(page)
    await loginPage.visitLoginPage();
})

test('Visibility test of login',async({page})=>{
    await expect(loginPage.userNameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.branchInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
})

test('Login to user test',async ({page})=>{
    await loginPage.loginToUser(loginCredential.userName,loginCredential.password,loginCredential.branch);
})