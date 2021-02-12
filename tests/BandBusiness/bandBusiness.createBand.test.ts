import { BandBusiness } from "../../src/business/BandBusiness";
import { BandInputDTO } from "../../src/business/entities/Band";
import { IdGenerator } from "../../src/services/IdGenerator";
import { Authenticator } from "../../src/services/TokenGenerator";

describe("Testing 'createBand' BandBusiness", () => {
    let idGenerator = { } as IdGenerator
    let bandDatabase = { } as any;
    let authenticator = { } as Authenticator
    
    test("Should return Unauthorized Error for role different than ADMIN", async () => {
        expect.assertions(3)

        authenticator = { getData: jest.fn(() => {
            return { id: "mockId", role: "NORMAL"}
        })} as any

        const input: BandInputDTO = {
            name: "mockName",
            musicGenre: "mockMusicGenre",
            responsible: "mockResponsible"
        }

        const bandBusiness = new BandBusiness(
            idGenerator,
            authenticator,
            bandDatabase
        )

        try {
            await bandBusiness.createBand("mockToken", input)
        } catch (error) {
            expect(error.statusCode).toBe(401)
            expect(error.message).toEqual("Only ADMIN users can register bands")
            expect(authenticator.getData).toHaveBeenCalledTimes(1)
        }
    })

    test("Should return Band", async () => {
        expect.assertions(5)

        authenticator = { getData: jest.fn(() => {
            return { id: "mockId", role: "ADMIN"}
        })} as any

        idGenerator = { generate: jest.fn(() => "mockBandId")}

        bandDatabase = { 
            createBand: jest.fn(), 
            selectAllBands: jest.fn(() => undefined ) 
        }

        const input: BandInputDTO = {
            name: "mockName",
            musicGenre: "mockMusicGenre",
            responsible: "mockResponsible"
        }

        const bandBusiness = new BandBusiness(
            idGenerator,
            authenticator,
            bandDatabase
        )

        const output = await bandBusiness.createBand("mockToken", input)

        expect(output).toEqual({
            id: "mockBandId",
            name: "mockName",
            musicGenre: "mockMusicGenre",
            responsible: "mockResponsible"
        })
        expect(authenticator.getData).toHaveBeenCalledTimes(1)
        expect(idGenerator.generate).toHaveBeenCalledTimes(1)
        expect(bandDatabase.selectAllBands).toHaveReturnedWith(undefined)
        expect(bandDatabase.createBand).toHaveBeenCalledTimes(1)
    })
})