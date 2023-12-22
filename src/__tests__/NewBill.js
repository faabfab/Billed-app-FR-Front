/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js"

import { newBill } from "../__mocks__/newBill"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

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

    test("Then page title is : Envoyer une note de frais", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      document.body.innerHTML = NewBillUI()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })


    describe("when bill file submitted", () => {
      test("Then the type is jpg", () => {

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
        const newBillContainer = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        })

        const handleChangeFile = jest.fn((e) => {
          newBillContainer.handleChangeFile(e)
        })
        const file = screen.getByTestId('file')
        file.addEventListener('change', handleChangeFile)
        fireEvent.change(file, { target: { files: mockFiles } })

        const formatError = file.getAttribute('data-error-visible')

        expect(handleChangeFile).toHaveBeenCalled()
        expect(formatError).toBe('false')

      });
    })

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
        const newBillContainer = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        })

        screen.getByTestId('expense-type').value = newSubmittedBill.type
        screen.getByTestId('expense-name').value = newSubmittedBill.name
        screen.getByTestId('datepicker').value = newSubmittedBill.date
        screen.getByTestId('amount').value = newSubmittedBill.amount
        screen.getByTestId('vat').value = newSubmittedBill.vat
        screen.getByTestId('pct').value = newSubmittedBill.pct
        screen.getByTestId('commentary').value = newSubmittedBill.commentary
        screen.getByTestId('file').file = newSubmittedBill.fileName

        newBillContainer.fileName = newSubmittedBill.fileName
        newBillContainer.fileUrl = newSubmittedBill.fileUrl

        expect(screen.getByTestId('file').file).toEqual('facture.jpg')
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

// Test d'intégration POST
describe("When the form is completed and user click on submit", () => {
  test("Then new bill is posted", async () => {
    const newSubmittedBill = newBill

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    document.body.innerHTML = NewBillUI()
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const newBillContainer = new NewBill({
      document, onNavigate, store, localStorage: window.localStorage
    })

    screen.getByTestId('expense-type').value = newSubmittedBill.type
    screen.getByTestId('expense-name').value = newSubmittedBill.name
    screen.getByTestId('datepicker').value = newSubmittedBill.date
    screen.getByTestId('amount').value = newSubmittedBill.amount
    screen.getByTestId('vat').value = newSubmittedBill.vat
    screen.getByTestId('pct').value = newSubmittedBill.pct
    screen.getByTestId('commentary').value = newSubmittedBill.commentary

    newBillContainer.fileName = newSubmittedBill.fileName
    newBillContainer.fileUrl = newSubmittedBill.fileUrl

    newBillContainer.updateBill = jest.fn()
    const handleSubmit = jest.fn((e) => newBillContainer.handleSubmit(e));

    const formBill = screen.getByTestId("form-new-bill");
    formBill.addEventListener("submit", handleSubmit);
    fireEvent.submit(formBill);

    expect(handleSubmit).toHaveBeenCalled();
    expect(newBillContainer.updateBill).toHaveBeenCalled()

  })
})
