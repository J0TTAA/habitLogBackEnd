import { Controller, Get } from "@nestjs/common"
import { ProgressService } from "./progress.service"

@Controller("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get("metrics")
  getProgressMetrics() {
    return this.progressService.getProgressMetrics()
  }

  @Get("xp-history")
  getXPHistory(days?: string) {
    const daysNumber = days ? Number.parseInt(days) : 30
    return this.progressService.getXPByTimeRange(daysNumber)
  }
}
