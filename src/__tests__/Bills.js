/**
 * @jest-environment jsdom
 */

import { getByTestId, screen, waitFor } from "@testing-library/dom"

import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

// import for 'Then eye icon event listener'
import userEvent from '@testing-library/user-event'
import { describe } from "yargs";

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
      document.body.innerHTML = BillsUI({ data: bills }) // met dans le corps de la page le résultat la fonction BillsUI avec bills
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    // =========================================================================
    // [Ajout de tests unitaires et d'intégration]
    // TODO: Btn note de frais
    describe("when I click on new bill button", () => {
      test('Open new bill page', () => {

      });
    })

    test('Then all bills have a eye button', () => {

    });

    describe('When I click on eye button', () => {
      test('Then the bill modal open ', () => {

      });
    })
    // =========================================================================



    /*
     test('then is new bill button', async () => {
      document.body.innerHTML = BillsUI({ data: bills }) // met dans le corps de la page le résultat la fonction BillsUI avec bills
      const handleClickNewBill = jest.fn(bills.handleClickNewBill)
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const newBillButton = screen.getByTestId('btn-new-bill')
      newBillButton.addEventListener('click', handleClickNewBill)
      expect(handleClickNewBill).not.toHaveBeenCalled()
      // expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    });

    // =========================================================================
    // src/__tests__/Dashboard.js#L231
    test('Then eye icon event listener', async () => {
      document.body.innerHTML = BillsUI({ data: bills }) // met dans le corps de la page le résultat la fonction BillsUI avec bills
      const handleClickIconEye = jest.fn(bills.handleClickIconEye)
      await waitFor(() => screen.getAllByTestId('icon-eye'))
      const eyes = screen.getAllByTestId('icon-eye')
      eyes.forEach(eye => {
        eye.addEventListener('click', handleClickIconEye)
        userEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()
      });

    });
    // =========================================================================
    */

  })
})
