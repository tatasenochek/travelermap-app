import styles from "./modal.module.scss";
import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";
import Button from "../Button/Button";
import { X } from "lucide-react";

interface IModalProps {
	isOpen: boolean;
	title?: string;
	children?: ReactNode;
	onClose: () => void;
	isConfirm: boolean;
	description?: string;
	onCloseIsConfirmed?: () => void;
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	isConfirm,
	description,
	onCloseIsConfirmed,
}: IModalProps) {
	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<Dialog static open={isOpen} onClose={onClose}>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className={styles.backdrop}
						/>
						<div className={styles.modal}>
							<DialogPanel
								as={motion.div}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
							>
								<header className={styles.modalHeader}>
									<DialogTitle className={styles.modalTitle}>
										{title}
									</DialogTitle>
									<Button
										onClick={onClose}
										variant="iconSecondary"
										aria-label="Закрыть"
									>
										<X />
									</Button>
								</header>
								<div className={styles.modalContent}>
									{isConfirm ? (
										<>
											<Description className={styles.modalDescription}>
												{description}
											</Description>
											<div className={styles.modalActions}>
												<Button onClick={onClose} variant="secondary">
													Отмена
												</Button>
												<Button onClick={onCloseIsConfirmed}>Да</Button>
											</div>
										</>
									) : (
										children
									)}
								</div>
							</DialogPanel>
						</div>
					</Dialog>
				)}
			</AnimatePresence>
		</>
	);
}
