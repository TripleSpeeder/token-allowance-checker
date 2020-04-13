import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './rootReducer'
import { ResponsiveOnUpdateData } from 'semantic-ui-react/dist/commonjs/addons/Responsive/Responsive'
import {
    Container,
    Header,
    Icon,
    Image,
    Menu,
    Responsive,
    Segment,
    Sidebar,
    Button,
} from 'semantic-ui-react'
import { setMobile } from '../features/responsiveLayout/responsiveSlice'
import { HashRouter as Router, Link } from 'react-router-dom'
import MainMenu from '../features/menu/MainMenu'
import WalletSelectorContainer from '../features/onboard/WalletSelectorContainer'
import NetworkSelector from '../components/NetworkSelector'

interface ResponsiveAppProps {
    children?: React.ReactNode
}
const ResponsiveApp = ({ children }: ResponsiveAppProps) => {
    const [prevMobile, setPrevMobile] = useState<boolean | undefined>(undefined)
    const [showSidebar, setShowSidebar] = useState(false)

    const { mobile } = useSelector((state: RootState) => state.respsonsive)
    const dispatch = useDispatch()

    const onResponsiveUpdate = (
        event: React.SyntheticEvent<HTMLElement>,
        data: ResponsiveOnUpdateData
    ) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const isMobile = data.width <= Responsive.onlyMobile.maxWidth
        if (isMobile !== prevMobile) {
            dispatch(setMobile(isMobile))
            setPrevMobile(isMobile)
        }
    }

    const DesktopHeading = (
        <Segment textAlign='center' vertical basic>
            <MainMenu />
            <Container
                text
                style={{
                    marginTop: '4em',
                    marginBottom: '2em',
                }}
            >
                <Header
                    as='h1'
                    inverted={false}
                    style={{
                        fontSize: '3em',
                        marginTop: '0.5em',
                    }}
                >
                    Token Allowance Checker
                    <Header.Subheader>
                        Control your token approvals
                    </Header.Subheader>
                </Header>
            </Container>
        </Segment>
    )

    let content
    if (mobile) {
        // No extra page header, use sidebar for menu
        content = (
            <>
                <Sidebar.Pushable>
                    <Menu fixed='top' inverted size='small'>
                        <Menu.Item onClick={() => setShowSidebar(true)}>
                            <Icon name={'bars'} />
                        </Menu.Item>
                        <Menu.Item style={{ padding: '0' }}>
                            <Link to={'/'}>
                                <Image
                                    src={'/logo192.png'}
                                    width={40}
                                    height={40}
                                />
                            </Link>
                        </Menu.Item>
                        <Menu.Item>Token Allowance Checker</Menu.Item>
                    </Menu>
                    <Sidebar
                        as={Menu}
                        animation={'overlay'}
                        inverted
                        onHide={() => setShowSidebar(false)}
                        vertical
                        visible={showSidebar}
                    >
                        <Menu.Item>
                            <WalletSelectorContainer />
                        </Menu.Item>
                        <Menu.Item>
                            <NetworkSelector />
                        </Menu.Item>
                        <Menu.Item>
                            <Button
                                icon
                                fluid
                                as={'a'}
                                href='https://github.com/TripleSpeeder/token-allowance-checker'
                                title='github.com/TripleSpeeder/token-allowance-checker'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Icon name='github' /> TAC on Github
                            </Button>
                        </Menu.Item>
                    </Sidebar>

                    <Sidebar.Pusher style={{ marginTop: '3em' }}>
                        {children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </>
        )
    } else {
        // use page header with classic menu
        content = (
            <>
                {DesktopHeading}
                {children}
            </>
        )
    }

    return (
        <Responsive
            as={Router}
            fireOnMount={true}
            onUpdate={onResponsiveUpdate}
        >
            {content}
        </Responsive>
    )
}

export default ResponsiveApp
