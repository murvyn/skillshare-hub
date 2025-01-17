import { login } from "@/api/authApi"
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"

export const useLogin = () => {
    const dispatch = useDispatch()
    return useMutation(login, {
        
    })
}