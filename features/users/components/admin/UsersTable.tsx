"use client";

import { useEffect, useState } from "react";
import { Search, ShieldCheck, UserRound, UserX } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import RoleBadge from "@/components/admin/RoleBadge";
import Avatar from "@/components/admin/ui/Avatar";
import Button from "@/components/admin/ui/Button";
import DataTable, { PrimaryCell } from "@/components/admin/ui/DataTable";
import EmptyState from "@/components/admin/ui/EmptyState";
import IconButton from "@/components/admin/ui/IconButton";
import Modal from "@/components/admin/ui/Modal";
import Pagination from "@/components/admin/ui/Pagination";
import { Panel } from "@/components/admin/ui/Panel";
import SelectInput from "@/components/admin/ui/SelectInput";
import TableToolbar from "@/components/admin/ui/TableToolbar";
import TextInput from "@/components/admin/ui/TextInput";
import Tooltip from "@/components/admin/ui/Tooltip";
import { ADMIN_PAGE_SIZE } from "@/constants/Admin";
import {
  useDeactivateUser,
  useUsers,
} from "@/features/users/hooks/UseUsers";
import type {
  AdminRole,
  AdminUser,
  UsersTableProps,
} from "@/features/users/types/Users";
import { fullName } from "@/features/users/utils/Users";
import { ApiError } from "@/lib/Api";
import type { Column } from "@/types/AdminUi";
import ChangeRoleModal from "./ChangeRoleModal";

// Searching, filtering and paging all happen on the server, same as the
// projects and categories grids: filtering the page already on screen would
// report "no matches" for a teammate who is simply on another page.
//
// There is no status column. `GET /api/users` filters `status: "active"` and
// offers no way to ask for anything else, so the value would read "active" on
// every row forever — and a deactivated account leaves the list entirely,
// which is the confirmation the action needs.
export default function UsersTable({ canManage, viewerId }: UsersTableProps) {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("admin.common");
  const format = useFormatter();

  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ADMIN_PAGE_SIZE);
  const [pendingRole, setPendingRole] = useState<AdminUser | null>(null);
  const [pendingDeactivate, setPendingDeactivate] = useState<AdminUser | null>(
    null,
  );

  // Debounced so a request isn't fired on every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const usersQuery = useUsers({
    page,
    limit,
    ...(q !== "" ? { q } : {}),
    ...(role !== "" ? { role: role as AdminRole } : {}),
  });
  const deactivateUser = useDeactivateUser();

  const rows = usersQuery.data?.data ?? [];
  const pagination = usersQuery.data?.pagination;
  const loadError =
    usersQuery.error instanceof ApiError ? usersQuery.error.message : undefined;
  const isFiltered = q !== "" || role !== "";

  function resetFilters() {
    setSearch("");
    setQ("");
    setRole("");
    setPage(1);
  }

  /**
   * Why a row's actions are withheld, or `undefined` when they are available.
   * Doubles as the tooltip label, so the button is never just inert with no
   * explanation.
   */
  function blockedReason(user: AdminUser) {
    if (!canManage) return t("superAdminOnly");
    if (user._id === viewerId) return t("selfActionHint");
    return undefined;
  }

  const columns: Column<AdminUser>[] = [
    {
      id: "name",
      header: t("table.name"),
      cell: (user) => (
        <PrimaryCell
          media={<Avatar name={fullName(user)} imageUrl={user.imageUrl} />}
          title={fullName(user)}
          subtitle={user.email}
        />
      ),
    },
    {
      id: "role",
      header: t("table.role"),
      className: "w-36",
      cell: (user) => <RoleBadge role={user.role} />,
    },
    {
      id: "joined",
      header: t("table.joined"),
      className: "w-36",
      cell: (user) => (
        <span className="text-ink-muted">
          {format.dateTime(new Date(user.createdAt), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <>
      <Panel flush>
        <TableToolbar
          search={
            <TextInput
              icon={Search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
            />
          }
          filters={
            <SelectInput
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setPage(1);
              }}
              aria-label={t("table.role")}
              className="w-40"
            >
              <option value="">{t("allRoles")}</option>
              <option value="super_admin">{tCommon("roleSuperAdmin")}</option>
              <option value="admin">{tCommon("roleAdmin")}</option>
              <option value="user">{tCommon("roleUser")}</option>
            </SelectInput>
          }
          // The disabled buttons carry a tooltip, but tooltips are hidden below
          // `md` (a touch screen has no hover), so a plain admin would meet
          // three dead buttons with no reason given. This line always shows.
          trailing={
            canManage ? undefined : (
              <span className="text-xs text-ink-faint">
                {t("superAdminOnly")}
              </span>
            )
          }
        />

        {usersQuery.isPending && !usersQuery.data ? (
          <div className="flex flex-col gap-3 px-4 py-6" aria-busy>
            <span className="sr-only">{tCommon("loading")}</span>
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-surface-3"
              />
            ))}
          </div>
        ) : usersQuery.isError ? (
          <EmptyState
            icon={UserRound}
            title={tCommon("loadError", {
              message: loadError ?? tCommon("noResults"),
            })}
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(user) => user._id}
              actionsLabel={tCommon("actions")}
              empty={
                <EmptyState
                  icon={UserRound}
                  title={isFiltered ? tCommon("noMatches") : t("emptyTitle")}
                  description={
                    isFiltered
                      ? tCommon("noMatchesHint")
                      : t("emptyDescription")
                  }
                  action={
                    isFiltered ? (
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        {tCommon("clearFilters")}
                      </Button>
                    ) : undefined
                  }
                />
              }
              rowActions={(user) => {
                const reason = blockedReason(user);

                return (
                  <>
                    <Tooltip
                      label={reason ?? t("changeRole")}
                      side="start"
                      enabled={reason !== undefined}
                    >
                      <IconButton
                        size="sm"
                        aria-label={t("changeRole")}
                        disabled={reason !== undefined}
                        onClick={() => setPendingRole(user)}
                      >
                        <ShieldCheck aria-hidden />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      label={reason ?? t("deactivate")}
                      side="start"
                      enabled={reason !== undefined}
                    >
                      <IconButton
                        size="sm"
                        variant="danger"
                        aria-label={t("deactivate")}
                        disabled={
                          reason !== undefined || user.status === "deactivated"
                        }
                        onClick={() => setPendingDeactivate(user)}
                      >
                        <UserX aria-hidden />
                      </IconButton>
                    </Tooltip>
                  </>
                );
              }}
            />

            {rows.length > 0 && pagination && (
              <Pagination
                page={pagination.page}
                limit={limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                onLimitChange={(next) => {
                  setLimit(next);
                  setPage(1);
                }}
              />
            )}
          </>
        )}
      </Panel>

      {/* Keyed by the selected user so opening a different row remounts the
          modal and re-seeds its select from that user's current role. */}
      <ChangeRoleModal
        key={pendingRole?._id ?? "none"}
        user={pendingRole}
        onClose={() => setPendingRole(null)}
      />

      <Modal
        open={pendingDeactivate !== null}
        onClose={() => {
          if (!deactivateUser.isPending) setPendingDeactivate(null);
        }}
        closeLabel={tCommon("cancel")}
        title={t("deactivateTitle")}
        description={
          pendingDeactivate
            ? `${fullName(pendingDeactivate)} — ${t("deactivateDescription")}`
            : undefined
        }
        footer={
          <>
            <Button
              variant="ghost"
              disabled={deactivateUser.isPending}
              onClick={() => setPendingDeactivate(null)}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="danger"
              loading={deactivateUser.isPending}
              onClick={() => {
                if (!pendingDeactivate) return;
                // Closed from `onSuccess` only: a failed call keeps the dialog
                // open so the toast's explanation lands next to the action it
                // is about, instead of behind a dialog that already closed.
                deactivateUser.mutate(pendingDeactivate._id, {
                  onSuccess: () => setPendingDeactivate(null),
                });
              }}
            >
              {t("deactivate")}
            </Button>
          </>
        }
      />
    </>
  );
}
