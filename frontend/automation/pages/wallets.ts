import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const wallets = (page: Page) => {
  const locators = {
    goToCreateWalletButton: page.getByTestId('create-new-wallet'),
    header: page.getByTestId('header-title')
  }
  return {
    ...locators,
    goToCreateWalletPage: async () => locators.goToCreateWalletButton.click(),
    openWalletAndAssertName: async (walletName: string) => {
      await page.getByTestId(`wallet-${walletName.replace(' ', '-')}`).click()
      await expect(locators.header).toHaveText(walletName)
    }
  }
}
export default wallets
