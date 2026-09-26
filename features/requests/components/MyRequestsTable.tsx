"use client";

import { Inbox } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import Button from "@/components/kit/Button";
import DataTable, { PrimaryCell } from "@/components/kit/DataTable";
import EmptyState from "@/components/kit/EmptyState";
import Pagination from "@/components/kit/Pagination";
import { Panel } from "@/components/kit/Panel";
import TableState from "@/components/kit/TableState";
import LeadStatusBadge from "@/components/shared/LeadStatusBadge";
import { useListControls } from "@/hooks/UseListControls";
import type { Column } from "@/types/Kit";
import { useRequests } from "../hooks/UseRequests";
import type { PlanRequest } from "../types/Requests";

// The customer's own requests. Only ever shown to a non-admin — the page sends
// an admin to the panel first — so `GET /api/requests` returns this account's
// requests and nobody else's, which the backend enforces by itself.
//
// Paging is on the server, same as every admin grid, through the same
// `useListControls`: there is no search box and no filter, because the API
// has no `q` and a customer with a handful of requests doesn't need one — so
// `params` only ever carries `page` and `limit`.
export default function MyRequestsTable() {
  const t = useTranslations("requests");
  const tTypes = useTranslations("requests.types");
  const format = useFormatter();

  const list = useListControls({});
  const requestsQuery = useRequests(list.params);

  const rows = requestsQuery.data?.data ?? [];
  const pagination = requestsQuery.data?.pagination;

  const columns: Column<PlanRequest>[] = [
    {
      id: "product",
      header: t("table.product"),
      cell: (request) => (
        <PrimaryCell
          title={request.productName}
          subtitle={<span dir="ltr">{request.phone}</span>}
        />
      ),
    },
    {
      id: "type",
      header: t("table.type"),
      className: "w-28",
      cell: (request) => (
        <span className="text-ink-muted">{tTypes(request.requestType)}</span>
      ),
    },
    {
      id: "price",
      header: t("table.price"),
      className: "w-36",
      cell: (request) => (
        <span dir="ltr" className="text-ink">
          € {request.productPrice}
          {request.billingCycle && (
            <span className="ms-1 text-xs text-ink-faint">
              / {request.billingCycle}
            </span>
          )}
        </span>
      ),
    },
    {
      id: "date",
      header: t("table.date"),
      className: "w-36",
      cell: (request) => (
        <span className="text-ink-muted">
          {format.dateTime(new Date(request.createdAt), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      className: "w-36",
      cell: (request) => <LeadStatusBadge status={request.status} />,
    },
  ];

  return (
    <Panel flush>
      <TableState
        isLoading={requestsQuery.isPending && !requestsQuery.data}
        error={requestsQuery.error}
        icon={Inbox}
      >
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(request) => request._id}
          // The public navbar is taller than the panel's header.
          stickyOffset="lg:top-20"
          empty={
            <EmptyState
              icon={Inbox}
              title={t("empty.title")}
              description={t("empty.description")}
              action={
                <Button variant="primary" size="sm" href="/hosting/vps">
                  {t("empty.action")}
                </Button>
              }
            />
          }
        />

        {rows.length > 0 && pagination && (
          <Pagination
            page={pagination.page}
            limit={list.limit}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={list.setPage}
            onLimitChange={list.setLimit}
          />
        )}
      </TableState>
    </Panel>
  );
}
