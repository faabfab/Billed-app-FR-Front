/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import { localStorageMock } from "../__mocks__/localStorage.js";



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
      test("jpg", async () => {
        const billFile = 'bill.jpg'
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
        const formatError = screen.getByTestId('format_error')
        expect(formatError.classList.contains('format_error_hide')).toBe(true)

        file.setAttribute('value', billFile)
        expect(file.getAttribute('value')).toEqual('bill.jpg')
        fireEvent.change(file)
        expect(handleChangeFile).toHaveBeenCalled()
        expect(formatError.textContent).toEqual('Le document doit être jpg, jpeg ou png')
        // expect(formatError.classList.contains('format_error_hide')).toBe(true)
      })
      test("not jpg", () => {
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
      })
    })
    // =========================================================================
  })
})
