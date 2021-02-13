import { BandBusiness } from "../../src/business/BandBusiness";
import { Band, BandInputDTO } from "../../src/business/entities/Band";
import { IdGenerator } from "../../src/services/IdGenerator";
import { Authenticator } from "../../src/services/TokenGenerator";

describe("Testing 'getBandByProperty' BandBusiness", () => {
    let idGenerator = { } as IdGenerator
    let bandDatabase = { } as any;
    let authenticator = { } as Authenticator
    
    test("Should return and error for empty 'id' and 'name'", async () => {
        expect.assertions(3)

        authenticator = { getData: jest.fn(() => {
            return { id: "mockId", role: "NORMAL"}
        })} as any

        const bandBusiness = new BandBusiness(
            idGenerator,
            authenticator,
            bandDatabase
        )

        try {
            await bandBusiness.getBandByProperty("mockToken", "", "")
        } catch (error) {
            expect(error.statusCode).toBe(406)
            expect(error.message).toEqual("Please inform 'id' or 'name' to proceed the query")
            expect(authenticator.getData).toHaveBeenCalledTimes(1)
        }
    })

    test("Should return Band", async () => {
        expect.assertions(2)

        authenticator = { getData: jest.fn(() => {
            return { id: "mockId", role: "ADMIN"}
        })} as any

        const mockBand = new Band(
            "mockId",
            "mockName",
            "mockMusicGenre",
            "mockResponsible"
        )

        bandDatabase = { 
            selectBandById: jest.fn(() => mockBand ),
            selectBandByName: jest.fn(() => mockBand )
        }

        const bandBusiness = new BandBusiness(
            idGenerator,
            authenticator,
            bandDatabase
        )

        const output = await bandBusiness.getBandByProperty("token", "", "name")

        expect(output).toEqual(mockBand)
        expect(authenticator.getData).toHaveBeenCalledTimes(1)
    })
})