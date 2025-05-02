"use client"

import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import { APP_URL } from "@/lib/constants"

export function FarcasterActions() {
  const { actions } = useMiniAppContext()

  return (
    <div className="space-y-4 border border-orange-300 rounded-md p-4 bg-orange-50">
      <h2 className="text-xl font-bold text-left text-orange-800">App Actions</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        {actions ? (
          <div className="flex flex-col space-y-4 justify-start w-full">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 text-sm transition-colors"
              onClick={() => actions?.addFrame()}
            >
              Save App
            </button>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 text-sm transition-colors"
              onClick={() => actions?.close()}
            >
              Close App
            </button>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 text-sm transition-colors"
              onClick={() =>
                actions?.composeCast({
                  text: "I'm predicting Bitcoin prices on mutu's Bitcoin Price Prediction app! Join me!",
                  embeds: [`${APP_URL}`],
                })
              }
            >
              Share App
            </button>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 text-sm transition-colors"
              onClick={() => actions?.viewProfile({ fid: 17979 })}
            >
              View Creator Profile
            </button>
          </div>
        ) : (
          <p className="text-sm text-left text-orange-700">Actions not available</p>
        )}
      </div>
    </div>
  )
}
