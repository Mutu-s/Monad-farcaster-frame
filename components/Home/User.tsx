import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import Image from "next/image"

export function User() {
  const { context } = useMiniAppContext()

  return (
    <div className="space-y-4 border border-orange-300 rounded-md p-4 bg-orange-50">
      <h2 className="text-xl font-bold text-left text-orange-800">User Profile</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        {context?.user ? (
          <>
            {context?.user?.pfpUrl && (
              <Image
                src={context?.user?.pfpUrl || "/placeholder.svg"}
                className="w-14 h-14 rounded-full border-2 border-orange-300"
                alt="User Profile Picture"
                width={56}
                height={56}
              />
            )}
            <div className="flex flex-col justify-start items-start space-y-2">
              <p className="text-sm text-left text-orange-700">
                Display Name:{" "}
                <span className="bg-orange-200 font-medium text-orange-900 rounded-md p-[4px]">
                  {context?.user?.displayName}
                </span>
              </p>
              <p className="text-sm text-left text-orange-700">
                Username:{" "}
                <span className="bg-orange-200 font-medium text-orange-900 rounded-md p-[4px]">
                  @{context?.user?.username}
                </span>
              </p>
              <p className="text-sm text-left text-orange-700">
                FID:{" "}
                <span className="bg-orange-200 font-medium text-orange-900 rounded-md p-[4px]">
                  {context?.user?.fid}
                </span>
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-left text-orange-700">User context not available</p>
        )}
      </div>
    </div>
  )
}
