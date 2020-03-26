import { Container, Icon, Message } from 'semantic-ui-react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

/*
 * Display message about gitcoin grant. Message can be dismissed, but will
 * re-appear when user goes back to home page
 */
const GrantMessage = () => {
    const [showGrantMessage, setShowGrantMessage] = useState(true)
    const history = useHistory()

    // when route changes to home page, show grants message again
    useEffect(() => {
        const unlisten = history.listen(location => {
            if (location.pathname === '/') {
                setShowGrantMessage(true)
            }
        })
        return function() {
            unlisten()
        }
    }, [history, setShowGrantMessage])

    const onDismiss = () => {
        setShowGrantMessage(false)
    }

    if (showGrantMessage) {
        return (
            <Container textAlign={'center'}>
                <Message
                    color={'yellow'}
                    size={'big'}
                    icon
                    onDismiss={onDismiss}
                >
                    <Icon name={'hand point right'} />
                    <Message.Content>
                        <Message.Header>
                            Gitcoin Grants <em>$250k Matching Round</em> is live
                            until 2020-04-07!
                        </Message.Header>
                        <div>
                            Do you like this project? Contribute to the{' '}
                            <strong>gitcoin grant</strong> to support further
                            development!
                        </div>
                        <p>
                            <strong>
                                -&gt;{' '}
                                <a
                                    target={'_blank'}
                                    rel={'noopener noreferrer'}
                                    href={
                                        'https://gitcoin.co/grants/480/token-allowance-checker?tab=description'
                                    }
                                >
                                    Gitcoin Grant Page
                                </a>{' '}
                                &lt;-
                            </strong>
                        </p>
                    </Message.Content>
                </Message>
            </Container>
        )
    } else return null
}

export default GrantMessage
