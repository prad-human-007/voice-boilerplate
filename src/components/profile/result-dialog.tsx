import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function ResultDialog( props : {
    showDialog: boolean;
    setShowDialog: (state: boolean) => void;
    content: string
}) {

    const router = useRouter()

    return (
        <>
            <Dialog open={props.showDialog} onOpenChange={() => props.setShowDialog(false)}  >
              <DialogContent>
                <DialogHeader>
                  <h2>This is Dialog Header</h2>
                </DialogHeader>
                <div>{props.content}</div>
                <DialogFooter>
                    <div className="flex w-full justify-center gap-3">
                        <Button onClick={() => props.setShowDialog(false)}> Back to chat </Button>
                        <Button onClick={() => router.push('/account')}> Go to Dashboard </Button>
                    </div>
                   
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </>
    )
}