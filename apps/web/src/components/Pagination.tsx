import { Group, Button, Text } from '@ui8kit/core'

type PaginationProps = {
  page: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ page, total, onPrev, onNext }: PaginationProps) {
  return (
    <Group 
      items="center" 
      justify="between"
      data-class="pagination"
    >
      <Button 
        variant="outline" 
        onClick={onPrev} 
        disabled={page <= 1}
        size="sm"
        data-class="pagination-prev"
      >
        Previous
      </Button>

      <Text 
        fontSize="sm" 
        textColor="muted-foreground"
        data-class="pagination-info"
      >
        Page {page} of {total}
      </Text>

      <Button 
        onClick={onNext} 
        disabled={page >= total}
        size="sm"
        data-class="pagination-next"
      >
        Next
      </Button>
    </Group>
  )
}
