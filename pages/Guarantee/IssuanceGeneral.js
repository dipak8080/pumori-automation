class IssuanceGeneral {
  constructor(page) {
    this.page = page;
    this.generalTab = page.locator('ol li').nth(1);
    this.cyCode = page.locator('input[name="cyCodeGt"]');
    this.cyDesc = page.locator('input[name="cyGtDesc"]');
    this.guaranteeAmount = page.locator('input[name="baseAmount"]');
    this.exchangeRate = page.locator('input[name="cyRate"]');
    this.lcyEquivalent = page.locator('input[name="lcyAmount"]');


    this.issueDate = page.locator('input[data-testid="eng-date-picker"]').first();
    this.valueDate = page.locator('input[data-testid="eng-date-picker"]').nth(1);
    this.expiryDate = page.locator('input[data-testid="eng-date-picker"]').nth(2);
    this.claimDate = page.locator('input[data-testid="eng-date-picker"]').nth(3);

    this.nextMonthButton = page.locator('button[name="next-month"]').first()

    //days
    this.valueDayPick = page.getByRole('gridcell', { name: '1', exact: true });
    this.expiryDayPick = page.getByRole('gridcell', { name: '5', exact: true });
    this.claimDatePick = page.getByRole('gridcell', { name: '10', exact: true });



    this.contraAc = page.locator('[title]', { hasText: /\d+/ });
    this.contraAcName = page.locator('input[name="contraAcName"]')


    //Footer tab
    this.nextAndSaveButton = page.locator('button[title="Save & Next"]');

  }

  async clickGeneralTab() {
    await this.generalTab.click();
  }

  async fillGuaranteeAmount(amount) {
    await this.guaranteeAmount.fill(amount);
  }

  async clickNextAndSaveButton() {
    await this.nextAndSaveButton.click();
  }

  async fillExchangeRate(rate) {
    await this.exchangeRate.fill(rate);
  }

  async clickValueDate() {
    await this.valueDate.click();
  }

  async clickNextMonth() {
    await this.nextMonthButton.click();
  }

  //Universal day selector
  async selectValueDay() {
    await this.valueDayPick.click();
  }
  async selectExpiryDay() {
    await this.expiryDayPick.click();
  }

  async selectClaimDay() {
    await this.claimDatePick.click();
  }

  async clickExpiryDate() {
    await this.expiryDate.click();
  }

  async clickClaimDate() {
    await this.claimDate.click();
  }

}

module.exports = IssuanceGeneral;