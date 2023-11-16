/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"

import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

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

    // =========================================================================
    // TODO: test unitaire sur [ icon-eye ] event listener
    // src/__tests__/Dashboard.js#L231
    test('Then eye icon event listener', () => {
      /*
      document.body.innerHTML = BillsUI({ data: bills }) // met dans le corps de la page le résultat la fonction BillsUI avec bills
      const handleClickIconEye = jest.fn(bills.handleClickIconEye)
      const eye = screen.getByTestId('icon-eye')
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()
      */
    });
    // =========================================================================

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills }) // met dans le corps de la page le résultat la fonction BillsUI avec bills
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})
