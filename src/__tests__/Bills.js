/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"

import userEvent from '@testing-library/user-event'

import Bills from "../containers/Bills.js"

import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

import mockStore from "../__mocks__/store"


describe("Given I am connected as an employee", () => {
  test('Then, Loading page should be rendered', () => {
    // DOM construction
    document.body.innerHTML = BillsUI({ loading: true });

    // expected result
    expect(screen.getAllByText('Loading...')).toBeTruthy();
  });
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
    // Test de return bills
    test("Console log should have been called", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const store = null
      const billsContainer = new Bills({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });
      const getBills = jest.fn(billsContainer.getBills())
      getBills()
      // expect(getBills).toHaveBeenCalled()
      const logSpy = jest.spyOn(global.console, 'log')
      expect(logSpy).toHaveBeenCalled()
    })
    // =========================================================================
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    // TODO: [Ajout de tests unitaires et d'intégration]
    // =========================================================================


    test("Then title is Mes notes de frais", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const billsContainer = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      await waitFor(() => screen.getByText('Mes notes de frais'))
      expect(screen.getByText('Mes notes de frais')).toBeTruthy()
    })

    // bt nouvelle note de frais /src/__tests__/Logout.js
    describe("When I click on new bill button", () => {
      test("Then new bill page open", () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        document.body.innerHTML = BillsUI({ data: bills })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const billsContainer = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
        const handleClickNewBill = jest.fn(billsContainer.handleClickNewBill.bind(billsContainer))

        const newBillButton = screen.getByTestId('btn-new-bill')
        expect(newBillButton.textContent).toEqual('Nouvelle note de frais')
        newBillButton.addEventListener('click', handleClickNewBill)
        userEvent.click(newBillButton)
        expect(handleClickNewBill).toHaveBeenCalled()
        expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
      })
    })
    // =========================================================================

    // =========================================================================
    // open modal /src/__tests__/Dashboard.js#217
    describe('When I click on the icon eye', () => {
      test('Then a modal should open', () => {
        /*Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const billsContainer = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
        // const handleClickIconEye = jest.fn(billsContainer.handleClickIconEye.bind(billsContainer))
        const handleClickIconEye = jest.fn((icon) => {
          billsContainer.handleClickIconEye(icon)
        })
        const eye = screen.getAllByTestId('icon-eye')[0]

        const modale = screen.getByTestId('modaleFile')
        expect(modale).toBeTruthy()
        eye.addEventListener('click', handleClickIconEye(eye))
        fireEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()*/

        $.fn.modal = jest.fn();
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const store = null
        const billsContainer = new Bills({
          document,
          onNavigate,
          store: store,
          localStorage: window.localStorage,
        });

        const handleClickIconEye = jest.fn((e) => billsContainer.handleClickIconEye(e.target));
        const eye = screen.getAllByTestId("icon-eye")[0];
        eye.addEventListener("click", handleClickIconEye);
        userEvent.click(eye);
        expect(handleClickIconEye).toHaveBeenCalled();

        eye.addEventListener("click", (e) => {
          handleClickIconEye(e.target);
          const modale = screen.getByTestId("modaleFile");
          expect(modale).toHaveClass("show");

        })
      })

      /*
      test("Then the modal should display the attached image", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const billsContainer = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
        const eye = screen.getAllByTestId('icon-eye')[0]
        const handleClickIconEye = jest.fn((icon) => {
          billsContainer.handleClickIconEye(icon)
        })
        eye.addEventListener('click', handleClickIconEye(eye))
        expect(document.querySelector('.modal')).toBeTruthy()

      })
      */
    })
    // =========================================================================
  })
})



// =============================================================================
// TODO: Test d'intégration GET
// /src/__tests__/Dashboard.js#L244

// jest.mock("../app/store", () => mockStore)

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentType = await screen.getByText("Type")
      expect(contentType).toBeTruthy()
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy()
    })
  })

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      // const message = await screen.getByText(/Erreur 404/)
      const message = await screen.getByText('Erreur')
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      // const message = await screen.getByText(/Erreur 500/)
      const message = await screen.getByText('Erreur')
      expect(message).toBeTruthy()
    })
  })

})

// =============================================================================