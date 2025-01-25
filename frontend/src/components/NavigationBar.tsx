import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useDispatch } from 'react-redux'
import { logout } from "@/store/userSlice";
import Cookies from "js-cookie";

export function NavigationBar() {
    const {currentUser} = useSelector((state : RootState) => state.user)
    const dispatch = useDispatch()
    const logoutUser = () => {
        dispatch(logout())
        Cookies.remove("auth-x-token")
    }
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#1E90FF]">SkillShare Hub</Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li><Link href="/courses" className="text-gray-600 hover:text-[#1E90FF]">Courses</Link></li>
            <li><Link href="/libraries" className="text-gray-600 hover:text-[#1E90FF]">Libraries</Link></li>
            <li><Link href="/teach" className="text-gray-600 hover:text-[#1E90FF]">Teach</Link></li>
            {currentUser ? 
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@johndoe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        john@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div onClick={logoutUser}>Log out</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            : 
            <>
             <li><Link href="/auth/login" className="text-gray-600 hover:text-[#1E90FF]">Login</Link></li>
             <li><Link href="/auth/signup" className="bg-[#1E90FF] text-white px-4 py-2 rounded-md hover:bg-blue-600">Sign Up</Link></li>
            </>
            }
          </ul>
        </nav>
      </div>
    </header>
  )
}