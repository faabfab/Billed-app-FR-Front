/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"

import Bills from "../containers/Bills.js"

import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      // =======================================================================
      expect(windowIcon.getAttribute('class')).toEqual('active-icon')
      // =======================================================================
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    // TODO: [Ajout de tests unitaires et d'intégration]
    // =========================================================================
    // bt nouvelle note de frais
    test("When I click on new bill button", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const newBillButton = screen.getByTestId('btn-new-bill')
      expect(newBillButton.textContent).toEqual('Nouvelle note de frais')
      // TODO: Tester si il y a event listener sur le bt
    })
    // =========================================================================

    // =========================================================================
    // open modal /src/__tests__/Dashboard.js#217
    describe('When I click on the icon eye', () => {
      test('A modal should open', async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)

        document.body.innerHTML = BillsUI({ data: bills })

        /*const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }*/
        const store = null

        const newBill = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })


        const handleClickIconEye = jest.fn(newBill.handleClickIconEye)

        await waitFor(() => screen.getAllByTestId('icon-eye'))
        const eyes = screen.getAllByTestId('icon-eye')

        eyes.forEach((eye) => {
          eye.addEventListener('click', handleClickIconEye(eye))
          userEvent.click(eye)
          expect(handleClickIconEye(eye)).toHaveBeenCalled()
        })
      })
    })
    // =========================================================================

  })
})