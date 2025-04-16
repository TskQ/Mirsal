import { Logo } from "./logo"
import { Instagram, GitlabIcon as GitHub } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-sand-100 dark:bg-dune-900 border-t border-sand-200 dark:border-dune-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-dune-600 dark:text-sand-400 mb-4">
              A desert-themed chat platform where messages rise from the dunes, connecting people across the digital
              landscape.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-dune-500 hover:text-sand-600 dark:text-sand-400 dark:hover:text-sand-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-dune-500 hover:text-sand-600 dark:text-sand-400 dark:hover:text-sand-300">
                <GitHub size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-dune-800 dark:text-sand-100">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-dune-600 hover:text-sand-600 dark:text-sand-400 dark:hover:text-sand-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-dune-600 hover:text-sand-600 dark:text-sand-400 dark:hover:text-sand-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-dune-600 hover:text-sand-600 dark:text-sand-400 dark:hover:text-sand-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-dune-800 dark:text-sand-100">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-dune-600 hover:text-sand-600 dark:text-sand-400 dark:hover:text-sand-300">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-dune-600 hover:text-sand-600 dark:text-sand-400 dark:hover:text-sand-300">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-dune-600 hover:text-sand-600 dark:text-sand-400 dark:hover:text-sand-300">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sand-200 dark:border-dune-800 text-center text-dune-600 dark:text-sand-400">
          <p>&copy; {new Date().getFullYear()} Mirsal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
