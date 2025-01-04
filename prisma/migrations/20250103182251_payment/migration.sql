-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "times" INTEGER,
    "observation" TEXT,
    "firstDate" TIMESTAMP(3),
    "lastDate" TIMESTAMP(3),
    "dayOfPayment" TIMESTAMP(3),
    "installmentDate" INTEGER,
    "giftGiver" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPayment" (
    "jobId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "JobPayment_pkey" PRIMARY KEY ("jobId","paymentId")
);

-- AddForeignKey
ALTER TABLE "JobPayment" ADD CONSTRAINT "JobPayment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPayment" ADD CONSTRAINT "JobPayment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
