/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";

import { newBill } from "../__mocks__/newBill"



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // =========================================================================
    // Mail Icon
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.getAttribute('class')).toEqual('active-icon')
    })
    // =========================================================================
    // =========================================================================
    // Page title
    test("then page title is : Envoyer une note de frais", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      document.body.innerHTML = NewBillUI()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
    // =========================================================================
    // =========================================================================
    // TODO: test file type is good
    describe("when bill file type is", () => {
      test("jpg", () => {

        const mockFiles = [new File(['newBill'], 'newBill.jpg', { type: 'image/jpeg' })]
        expect(mockFiles[0].type).toEqual('image/jpeg')

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = NewBillUI()
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const newBillContainer = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        })

        const handleChangeFile = jest.fn((e) => {
          // e.preventDefault()
          newBillContainer.handleChangeFile(e)
        })
        const file = screen.getByTestId('file')
        // file.file = billFile
        file.addEventListener('change', handleChangeFile)
        fireEvent.change(file, { target: { files: mockFiles } })

        const formatError = file.getAttribute('data-error-visible')

        // expect(file.file).toEqual('bill.jpg')
        // expect(formatError.classList.contains('format_error_hide')).toBe(true)
        // BUG: La class hidden disparait ??
        // expect(formatError.classList.contains('format_error_hide')).toBe(true)

        expect(handleChangeFile).toHaveBeenCalled()
        expect(formatError).toBe('false')

      });
      /*test("not jpg", () => {
        const billFile = 'bill.png'
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        document.body.innerHTML = NewBillUI()

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const newBillContainer = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        })

        const handleChangeFile = jest.fn(newBillContainer.handleChangeFile.bind(newBillContainer))
        const file = screen.getByTestId('file')
        file.addEventListener('change', handleChangeFile)
        file.setAttribute('value', billFile)
        fireEvent.change(file)
        expect(handleChangeFile).toHaveBeenCalled()
        const formatError = screen.getByTestId('format_error')
        expect(formatError.getAttribute('class')).toEqual(null)
      })*/
    })
    // =========================================================================
    // =========================================================================
    // TODO: Test on submit button
    // =========================================================================

    describe("When user click on submit", () => {
      test("Then return on bills page", () => {

        const newSubmittedBill = newBill

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = NewBillUI()
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const newBillContainer = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        })
        const expenseType = screen.getByTestId('expense-type')
        expenseType.value = newSubmittedBill.type
        const expenseName = screen.getByTestId('expense-name')
        expenseName.value = newSubmittedBill.name
        const expenseDate = screen.getByTestId('datepicker')
        expenseDate.value = newSubmittedBill.date
        const expenseAmount = screen.getByTestId('amount')
        expenseAmount.value = newSubmittedBill.amount
        const expenseVat = screen.getByTestId('vat')
        expenseVat.value = newSubmittedBill.vat
        const expensePct = screen.getByTestId('pct')
        expensePct.value = newSubmittedBill.pct
        const expenseCommentary = screen.getByTestId('commentary')
        expenseCommentary.value = newSubmittedBill.commentary
        const expenseFile = screen.getByTestId('file')
        expenseFile.file = newSubmittedBill.fileName
        expect(expenseFile.file).toEqual('facture.jpg')
        const handleSubmit = jest.fn((e) => {
          e.preventDefault();
          newBillContainer.handleSubmit(e);
        })
        const newBillSubmit = screen.getByTestId('form-new-bill')
        newBillSubmit.addEventListener('submit', handleSubmit)
        fireEvent.submit(newBillSubmit)
        expect(handleSubmit).toHaveBeenCalled()
        expect(screen.getByText('Mes notes de frais')).toBeTruthy()
      })
    })
  })
})

// =============================================================================
// TODO: Test d'intégration POST

// =============================================================================