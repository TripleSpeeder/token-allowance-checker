import React from 'react'
import { Container } from 'semantic-ui-react'
import MainMenu from './MainMenu'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import store from '../../app/store'

export default {
    title: 'MainMenu',
    component: MainMenu,
    decorators: [
        (story: () => React.ReactNode) => (
            <Provider store={store}>{story()}</Provider>
        ),
        (story: () => React.ReactNode) => <Container>{story()}</Container>,
        (story: () => React.ReactNode) => (
            <MemoryRouter>{story()}</MemoryRouter>
        ),
    ],
}

export const mobile = () => <MainMenu />

export const desktop = () => <MainMenu />
