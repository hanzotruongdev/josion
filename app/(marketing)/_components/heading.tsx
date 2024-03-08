"use client"

import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/clerk-react"
import { useConvexAuth } from "convex/react"
import { ArrowRight, Github } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Heading() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Idears, Documents, & Plans. Unified. Welcome to <span>Jsosion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Josion is the connected workspace where <br />
        better, faster work happens.
      </h3>
      {
        isLoading && (
          <div className="w-full flex items-center justify-center">
            <Spinner size={"lg"} />
          </div>
        )
      }
      {isAuthenticated && !isLoading && (
        <div className="flex gap-x-2 items-center justify-center">
          <Button asChild>
            <Link href={"/documents"}>
              Enter <ArrowRight />
            </Link>
          </Button>

          <Button
            onClick={() => router.push('https://github.com/hanzotruongdev/josion')}
            variant={"outline"}
          >
            Github (HanzoTruong)
            <Github className="h-4"></Github>
          </Button>
        </div>

      )}
      {!isAuthenticated && !isLoading && (
        <div className="flex gap-x-2 justify-center items-center">
          <SignInButton mode="modal">
            <Button>
              Get Josion free
              <ArrowRight className="h-4"></ArrowRight>
            </Button>


          </SignInButton>

          <Button
            onClick={() => router.push('https://github.com/hanzotruongdev/josion')}
            variant={"outline"}
          >
            Github (HanzoTruong)
            <Github className="h-4"></Github>
          </Button>
        </div>
      )
      }

    </div>
  )
}