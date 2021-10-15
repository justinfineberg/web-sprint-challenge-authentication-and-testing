// Write your tests here
const db = require('../data/dbConfig')
const Users = require('./users/users-model')
const server = require('./server')
const request = require('supertest')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST]Register endpoint', ()=>{
  let res
  beforeEach(async()=>{
    res = await request(server).post('/api/auth/register').send({username: 'blah', password: '4321'})
  })
  it ('creates a new user', async()=>{
    expect(res.status).toBe(201)
  })
  it ('causes a user to be added to db ', async()=>{
    const allUsers = await db('Users')
    expect(allUsers).toHaveLength(1)
  })
})

describe('[POST] Login endpoint', ()=>{
  it('gives an error when username is not filled out', async()=>{
    let res = await request(server).post('/api/auth/login').send({username: "", password: "sldkjf"})
    expect(res.text).toBe("{\"message\":\"username and password required\"}")
  })
  it('responds with correct status on successful login', async()=>{
    let register = await request(server).post('/api/auth/register').send({username: 'blah', password: '4321'})
    let login = await request(server).post('/api/auth/login').send({username: "blah", password: "4321"})
    expect(login.status).toBe(200)
  })
})

describe('[GET] Jokes endpoint', ()=>{
  it('restricts getting all the jokes without successful login and therefore provides the right status code', async()=>{
    let res = await request(server).get('/api/jokes')
    expect(res.status).toBe(400)
  })
  it('restricts getting all the jokes without successful login and therefore provides the right message', async()=>{
    let res = await request(server).get('/api/jokes')
    expect(res.text).toBe("{\"message\":\"token required\"}")
  })
})