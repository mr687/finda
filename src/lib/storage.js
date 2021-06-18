const fs = require('fs')

const pathWaiting = './src/storage/waiting.json'
const pathRoom = './src/storage/rooms.json'

const stringify = JSON.stringify
const parser = JSON.parse

const addItem = async (path, value) => {
  const data = await getItem(path) || []
  data.push(value)
  fs.writeFileSync(path, stringify(data, null, '\t'))
}

const getItem = async (path) => {
  const data = fs.readFileSync(path)
  const parsed = parser(data)

  return parsed || []
}

const delItem = async (path, func) => {
  const data = await getItem(path)
  fs.writeFileSync(path, stringify(func(data), null, '\t'))
}

const addWaiting = async (value) => {
  await addItem(pathWaiting, value)
}

const getWaiting = async () => {
  const data = await getItem(pathWaiting)
  return data
}

const delWaiting = async (waiter) => {
  await delItem(pathWaiting, (waitings) => {
    let newList = []
    waitings.forEach(w => {
      if (w.remoteJid !== waiter.remoteJid) {
        newList.push(w)
      }
    })
    return newList
  })
}

const addRoom = async (data) => {
  const rooms = await getRooms()
  const checker = (p) => {
    return p.roomId.includes(data.client1.remoteJid) || p.roomId.includes(data.client2.remoteJid)
  }
  const checkIfExists = rooms.find(checker)
  if (checkIfExists === undefined) {
    await addItem(pathRoom, data)
  }
}

const getRooms = async () => {
  const rooms = await getItem(pathRoom)
  return rooms
}

const delRoom = async (room) => {
  await delItem(pathRoom, (rooms) => {
    let newRooms = []
    rooms.forEach(r => {
      if (r.roomId !== room.roomId) {
        newRooms.push(r)
      }
    })
    return newRooms
  })
}

module.exports = {
  addItem,
  getItem,
  delItem,
  addWaiting,
  getWaiting,
  delWaiting,
  addRoom,
  delRoom,
  getRooms
}