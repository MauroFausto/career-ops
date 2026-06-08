#!/usr/bin/env bash
# Spawn Delve headless in the OS terminal; poll port for VS Code/Cursor attach handshake.
set -euo pipefail

PORT="${DLV_PORT:-43000}"
DLV="${DLV_BIN:-${HOME}/go/bin/dlv}"
DASHBOARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CAREER_OPS_PATH="${CAREER_OPS_PATH:-${DASHBOARD_DIR}/..}"

if [[ ! -x "${DLV}" ]]; then
	echo "couldn't start listener: dlv not found at ${DLV}" >&2
	exit 1
fi

if ss -H -ltn "sport = :${PORT}" 2>/dev/null | grep -q .; then
	echo "couldn't start listener: port ${PORT} already in use" >&2
	exit 1
fi

dlv_cmd=(
	"${DLV}" debug
	--headless
	--api-version=2
	--accept-multiclient
	"--listen=127.0.0.1:${PORT}"
	.
	--
	--path
	"${CAREER_OPS_PATH}"
)

run_in_os_terminal() {
	local inner
	inner=$(printf '%q ' "${dlv_cmd[@]}")
	inner+="; echo; echo '[dlv stopped — press Enter]'; read -r"

	if command -v gnome-terminal >/dev/null 2>&1; then
		gnome-terminal --title="career-ops dlv :${PORT}" --working-directory="${DASHBOARD_DIR}" -- bash -lc "${inner}"
		return
	fi
	if command -v x-terminal-emulator >/dev/null 2>&1; then
		x-terminal-emulator -e bash -lc "cd $(printf '%q' "${DASHBOARD_DIR}") && ${inner}"
		return
	fi
	if command -v sensible-terminal >/dev/null 2>&1; then
		sensible-terminal -e bash -lc "cd $(printf '%q' "${DASHBOARD_DIR}") && ${inner}"
		return
	fi

	echo "couldn't start listener: no OS terminal emulator found" >&2
	exit 1
}

run_in_os_terminal

for _ in $(seq 1 80); do
	if ss -H -ltn "sport = :${PORT}" 2>/dev/null | grep -q .; then
		echo "API server listening at: 127.0.0.1:${PORT}"
		break
	fi
	sleep 0.25
done

if ! ss -H -ltn "sport = :${PORT}" 2>/dev/null | grep -q .; then
	echo "couldn't start listener: timeout waiting for port ${PORT}" >&2
	exit 1
fi

# Delve API clients do not show as ESTABLISHED in `ss` on the listen socket
# (verified: active `dlv connect` still yields empty `ss state established sport = :PORT`).
# preLaunchTask only needs the listener up; VS Code attach runs after beginsPattern matches.
exit 0
