export interface InvoiceSettings {
  // Header Settings
  title: string
  copyType: string
  companyLogo?: string
  signature?: string

  // Supplier Settings
  supplierName: string
  supplierAddress: string
  supplierGstin: string
  supplierState: string
  supplierCode: string
  supplierContact?: string

  // Bank Settings
  bankName: string
  accountName: string
  accountNumber: string
  branchName: string
  ifscCode: string

}
