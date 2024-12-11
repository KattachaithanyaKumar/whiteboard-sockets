import {Button, Input} from "antd"
import { useEffect, useState } from "react"
import {io} from "socket.io-client"

const socket = io("https://bookish-space-orbit-9xxrgjqjpv6fq4x-3000.app.github.dev");

const Auth = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected to server")
            setLoading(false)
        })
    }, [])


    if (loading) {
        return (
            <div className="auth">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <form className="auth">
            <Input size="large" addonBefore="Name" />
            <Input size="large" addonBefore="Room" />
            <Button type="primary">Go</Button>
        </form>
    )
}

export default Auth;