import { handleActions } from 'redux-actions'
import { fetchList } from '../types/todo.js'
import { TODO_FETCH_LIST, TODO_UPDATE, TODO_CREATE, TODO_REMOVE } from '../types/todo'

export default handleActions({
  [TODO_FETCH_LIST] (state, action) {
    if (action.error) {
      return state
    } else {
      return {
        ...state,
        list: action.payload
      }
    }
  },
  [TODO_UPDATE] (state, action) {
    if (action.error) {
      return state
    } else {
      console.log(action)
        // state.list.index.map((t) => {
        //     if (t.id == action.payload.id) {
        //         return action.payload
        //     } else {
        //         return t
        //     }
        // })
        console.log(state.list.index)
      return {
        ...state,
        list:{
           index: state.list.index.map((t) => {
            if (t.id == action.payload.id) {
                return action.payload
            } else {
                return t
            }
          })
        }
      }
    }
  },
  [TODO_CREATE] (state, action) {
    if (action.error) {
      return state
    } else {
      return {
        ...state,
        list: [action.payload, ...state.list]
      }
    }
  },
  [TODO_REMOVE] (state, action) {
    if (action.error) {
      return state
    } else {
      return {
        ...state,
        list: state.list.filter((t) => {
          return t._id !== action.meta.todoId
        })
      }
    }
  }
}, {
  list: []
})
