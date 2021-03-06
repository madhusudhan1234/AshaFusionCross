#!/bin/bash

#
# Copyright 2017 Yuichiro Tsuchiya
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

CWD=`dirname "${0}"`
APP_ROOT="`cd "${CWD}/../";pwd`"
SRC=$APP_ROOT/assets/img/logo.svg
DST=$APP_ROOT/assets/icons

convert_icon() {
    local size=$1
    local src=$2
    local dst=$3

    convert -background none -size $size -extent $size -gravity center $src $dst
}

create_mac() {
    local DST_DIR=$DST/asha.iconset/
    local sizes=(16 32 128 256 512 1024)

    mkdir -p $DST_DIR
    for i in "${sizes[@]}"
    do
        local SIZE=${i}x${i}
        local SIZE2X=$((i*2))x$((i*2))
        convert_icon $SIZE $SRC $DST_DIR/icon_$SIZE.png
        convert_icon $SIZE2X $SRC $DST_DIR/icon_$SIZE@2x.png
    done

    iconutil -c icns $DST_DIR
    rm -rf $DST_DIR
}

create_ico() {
    local DST_FILE=$DST/asha.ico
    local SIZE="256x256"

    mkdir -p $DST
    convert_icon $SIZE $SRC $DST_FILE
}

create_mac
create_ico
